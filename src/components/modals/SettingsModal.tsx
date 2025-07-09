import React from 'react';
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
import { getSettings } from '@store/app/AppSelectors';
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
      .matches(/^[a-fA-F0-9]{64,}$/, t('invalidPublicKeyFormat')),
    workProviderPublicKey: Yup.string()
      .required(t('authorPubKeyRequired'))
      .matches(/^[a-fA-F0-9]{64,}$/, t('invalidPublicKeyFormat')),
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
      payerPublicKey: settings.payerPublicKey || '',
      workProviderPublicKey: settings.workProviderPublicKey || '',
      network: settings.network || ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await dispatch(changeRelay(data));
      if (close) close();
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
