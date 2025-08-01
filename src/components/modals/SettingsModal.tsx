import React, { useEffect, useState } from 'react';
import { nip19 } from 'nostr-tools';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material';
import { useNotification } from '@hooks/UseNotificationHook';
import { NetworkTypeType } from '@objects/Enums';
import { getAddress, getCloseSettings, getSettings } from '@store/app/AppSelectors';
import { changeRelay } from '@store/app/AppThunks';
import { useDispatch, useSelector } from '@store/store';
import { PRIMARY_BLACK } from '@styles/colors';
import CustomInput from '../common/CustomInput'; // Adjust the path if needed
import { setSettings } from '@store/app/AppReducer';

export interface SettingsModalProps {
  close?: () => void;
}

const SettingsModal = ({ close }: SettingsModalProps) => {
  const { t } = useTranslation();
  const settings = useSelector(getSettings);
  const address = useSelector(getAddress);
  const closeSetting = useSelector(getCloseSettings);
  const dispatch = useDispatch();
  const { showError } = useNotification();

  const networkOptions = [
    { label: t('mainnet'), value: NetworkTypeType.Mainnet },
    { label: t('testnet'), value: NetworkTypeType.Testnet },
    { label: t('regtest'), value: NetworkTypeType.Regtest }
  ];

  const validationSchema = Yup.object().shape({
    relay: Yup.string()
      .required(t('relayUrlRequired'))
      .matches(
        /^(ws|wss):\/\/(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|localhost)(:[0-9]{1,5})?$/,
        t('invalidRelayFormat')
      ),
    payerPublicKey: Yup.string()
      .required(t('authorPubKeyRequired'))
      .test('is-valid-payer-pubkey', t('invalidPublicKeyFormat'), (value: any) => {
        return !!nip19.NostrTypeGuard.isNPub(value);
      }),
    workProviderPublicKey: Yup.string()
      .required(t('authorPubKeyRequired'))
      .test('is-valid-work-provider-pubkey', t('invalidPublicKeyFormat'), (value: any) => {
        return !!nip19.NostrTypeGuard.isNPub(value);
      }),
    network: Yup.string()
      .oneOf(
        networkOptions.map((option) => option.value),
        t('invalidNetworkType')
      )
      .required(t('networkTypeRequired'))
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      relay: settings.relay || '',
      payerPublicKey: nip19.npubEncode(settings.payerPublicKey) || '',
      workProviderPublicKey: nip19.npubEncode(settings.workProviderPublicKey) || '',
      network: settings.network || ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      data = {
        ...data,
        payerPublicKey: nip19.decode(data.payerPublicKey).data,
        workProviderPublicKey: nip19.decode(data.workProviderPublicKey).data
      };
      await dispatch(changeRelay(data));
    } catch (err: any) {
      console.error(err);
      showError({
        message: t('configError'),
        options: {
          position: 'bottom-center',
          toastId: 'invalid-address'
        }
      });
    }
  };

  useEffect(() => {
    if (closeSetting && close) {
      close();
    }
  }, [closeSetting]);

  return (
    <Box
      sx={{
        my: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}>
      <Typography
        sx={{
          mb: 2,
          fontWeight: 'bold !important',
          color: PRIMARY_BLACK,
          textAlign: 'center',
          typography: { xs: 'h6', md: 'h5' }
        }}>
        {t('settings')}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Box sx={{ py: 1 }}>
          <FormLabel component="legend" sx={{ paddingBottom: 1 }}>
            {t('relay')}
          </FormLabel>
          <CustomInput
            type="text"
            placeholder={t('relayUrl')}
            register={register('relay')}
            error={errors.relay}
            required
          />
        </Box>
        <Box sx={{ py: 1 }}>
          <FormLabel component="legend" sx={{ paddingBottom: 1 }}>
            {t('payerPublicKey')}
          </FormLabel>
          <CustomInput
            type="text"
            placeholder={t('publicKey')}
            register={register('payerPublicKey')}
            error={errors.payerPublicKey}
            required
          />
        </Box>

        <Box sx={{ py: 1 }}>
          <FormLabel component="legend" sx={{ paddingBottom: 1 }}>
            {t('workProviderPublicKey')}
          </FormLabel>
          <CustomInput
            type="text"
            placeholder={t('publicKey')}
            register={register('workProviderPublicKey')}
            error={errors.workProviderPublicKey}
            required
          />
        </Box>

        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">{t('network')}</FormLabel>
          <Controller
            name="network"
            control={control}
            defaultValue={settings.network || ''}
            render={({ field }) => (
              <RadioGroup row {...field}>
                {networkOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            )}
          />
        </FormControl>

        <Box mt={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary">
            {t('save')}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SettingsModal;
