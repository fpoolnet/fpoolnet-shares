import { Filter } from 'nostr-tools';
import { SubscriptionParams } from 'nostr-tools/lib/types/relay';
import { Service } from 'typedi';
import { NostrClient } from '@services/NostrClient';
import { getTimeBeforeDaysInSeconds } from '@utils/Utils';
import { PAYOUTS_PUBLIC_KEY, SHARES_PUBLIC_KEY } from '@constants/config';
@Service()
export class RelayService {
  public nostrClient: any;
  public payoutsSubscription: any;
  public sharesSubscription: any;
  public hashratesSubscription: any;

  constructor() {}

  subscribePayouts(address: string, subscriptionParams: SubscriptionParams) {
    this.stopPayouts();

    const filters: Filter[] = [
      {
        kinds: [35505],
        authors: [PAYOUTS_PUBLIC_KEY],
        since: getTimeBeforeDaysInSeconds(5),
        [`#a`]: [address]
      },
      {
        kinds: [35505],
        authors: [PAYOUTS_PUBLIC_KEY],
        limit: 500,
        [`#a`]: [address]
      }
    ];

    this.payoutsSubscription = this.nostrClient.subscribeEvent(filters, subscriptionParams);
    return this.payoutsSubscription;
  }

  async stopPayouts() {
    if (this.payoutsSubscription) {
      await this.payoutsSubscription.close();
      this.payoutsSubscription = null;
    }
  }

  subscribeShares(address: string, subscriptionParams: SubscriptionParams) {
    this.stopShares();

    const filters: Filter[] = [
      {
        kinds: [35503],
        authors: [SHARES_PUBLIC_KEY],
        limit: 500,
        [`#a`]: [address]
      }
    ];

    this.sharesSubscription = this.nostrClient.subscribeEvent(filters, subscriptionParams);
    return this.sharesSubscription;
  }

  async stopShares() {
    if (this.sharesSubscription) {
      await this.sharesSubscription.close();
      this.sharesSubscription = null;
    }
  }

  subscribeHashrates(address: string, subscriptionParams: SubscriptionParams) {
    this.stopHashrates();

    const filters: Filter[] = [
      {
        kinds: [35502],
        authors: [SHARES_PUBLIC_KEY],
        since: getTimeBeforeDaysInSeconds(1),
        limit: 500,
        [`#a`]: [address]
      }
    ];

    this.hashratesSubscription = this.nostrClient.subscribeEvent(filters, subscriptionParams);
    return this.hashratesSubscription;
  }

  async stopHashrates() {
    if (this.hashratesSubscription) {
      await this.hashratesSubscription.close();
      this.hashratesSubscription = null;
    }
  }

  async connectRelay(relayUrl: string, privateKey?: string) {
    if (!this.nostrClient) {
      this.nostrClient = new NostrClient({ relayUrl, privateKey });
      await this.nostrClient.connect();
    } else {
      const currentRelayUrl = this.nostrClient.relay.url.replace(/\/+$/, '').toLowerCase();
      const newRelayUrl = relayUrl.replace(/\/+$/, '').toLowerCase();
      if (currentRelayUrl != newRelayUrl) {
        await this.stopPayouts();
        await this.stopShares();
        await this.stopHashrates();
        await this.nostrClient.relay.close();
        this.nostrClient = new NostrClient({ relayUrl, privateKey });
        await this.nostrClient.connect();
      }
    }
  }
}
