import { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import { useActor } from '@xstate/react';
import { lookupPlaces, UserMachine } from './machine';

import './userInformation.css';
import { NftData, mapAssetToNftData } from '../Models/nft';
import { MDInput, MDDropdownSearch, MDSwitch } from '../design';
import { clearToken, getToken } from '../utils/tokenUtils';
import { searchAssetsByCollection } from '../utils/heliusrpc';
import { Asset } from '../types/helius';
import { getEnv } from '../utils/general';
import { toast } from 'react-toastify';

export const UserInformation = (): JSX.Element => {
  const { wallet, publicKey, connecting } = useWallet();
  const walletContext = useWallet();
  const { connection } = useConnection();
  const [nftArrayLoading, setNftArrayLoading] = useState(true);
  const [nftArray, setNftArray] = useState<NftData[]>([]);
  const walletId = publicKey?.toBase58();
  const navigate = useNavigate();
  const [state, send] = useActor(
    UserMachine.get({ wallet: walletContext, connection }),
  );

  wallet?.adapter?.addListener('disconnect', () => {
    console.log('disconnected');
    if (getToken()?.token && !connecting) {
      clearToken();
      navigate(0);
    }
  });

  console.log(state);
  useEffect(() => {
    let active = true;
    load();
    return () => {
      active = false;
    };

    async function load() {
      setNftArrayLoading(true);
      setNftArray([]);
      let nftResult: NftData[] = [];
      if (walletId) {
        const promiseAllResult = await Promise.all([searchAssetsByCollection(walletId, getEnv('COLLECTION')), searchAssetsByCollection(walletId, getEnv('COLLECTION2'))]);
        nftResult = (promiseAllResult as Asset[][]).flatMap(x => { return x.map(asset => mapAssetToNftData(asset)) });
        console.log(nftResult)
        nftResult = nftResult.map((item, index) => {
          const titleArray = item.name?.split('#');
          item.nftNumber = titleArray ? `${titleArray[1]}` : '';
          return item
        });

      }
      if (!active) {
        return;
      }
      setNftArrayLoading(false);
      setNftArray(nftResult);
    }
  }, [walletId, connection]);

  // const state = {matches: (s: any) => Boolean, value: '', context: {lat: 0, lng: 0}};
  // const send = (s: string, a?: any) => {}

  useEffect(() => {
    if (!walletId) {
      send('DISCONNECT');
    }
  }, [walletId]);

  const {
    nickName,
    twitter,
    github,
    telegram,
    discord,
    nft,
    location,
    isHardware,
  } = state.context;

  const monkeSelected = !!state.context.nft.id;
  const monkeSelectionError =
    ['edit.invalid', 'create.invalid'].some(state.matches) && !monkeSelected;
  const nickNameError =
    ['edit.invalid', 'create.invalid'].some(state.matches) &&
    !state.context.nickName;

  if (state.matches('none')) {
    return <Navigate to="/map"></Navigate>;
  } else {
    return (
      <div className="Profile__container">
        <div className="Profile__header">
          <Link className="Profile__back-link" to="/map">
            <button className="Profile__back button" onClick={() => { }}>
              <img
                className="Profile__back-icon"
                src="/MonkeDAO_Icons_Col/MonkeDAO_Icons_Working-89.svg"
                alt="MonkeDAO Profile Back Icon"
              />
              Back
            </button>
          </Link>
          <div className="Profile__actions">
            {['edit'].some(state.matches) && (
              <button
                className="Profile__save button button"
                onClick={() => send('RESET')}
              >
                Cancel
              </button>
            )}
            {!nftArrayLoading && ['edit', 'create'].some(state.matches) && (
              <button
                className="Profile__save button button--save"
                onClick={() => send('SAVE')}
                disabled={['edit.invalid', 'create.invalid'].some(
                  state.matches,
                )}
              >
                {state.matches('edit') ? 'Save' : 'Create'}
              </button>
            )}
          </div>
        </div>
        {!state.matches('loading') && (
          <div className="Profile__body-container">
            <div className="Profile__section">
              <h2 className="Profile__title">Wallet</h2>
              <WalletMultiButton />
            </div>

            <div className="Profile__section">
              <div className="Profile__gallery-container">
                <h2
                  className={`Profile__title ${monkeSelectionError
                      ? 'Profile__monke-selection-text--error'
                      : ''
                    }`}
                >
                  Monkes *
                </h2>
                {monkeSelectionError && (
                  <div className="Profile__monke-selection-text Profile__monke-selection-text--error">
                    Monke selection is required.
                  </div>
                )}
                {nftArray.length === 0 ? (
                  nftArrayLoading ? (
                    <div>Loading your Monkes...</div>
                  ) : (
                    <div className="Profile__gallery-none">
                      You don't have any Monkes :(
                    </div>
                  )
                ) : (
                  <div className="Profile__gallery">
                    {nftArray
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((x) => (
                        <div
                          key={x.mint}
                          className={`nft_gallery ${x.mint === nft.id ? 'nft_gallery--selected' : ''
                            }`}
                        >
                          <img
                            className="nft_gallery_img"
                            alt="smb"
                            src={x.imageUri}
                            onClick={() => {
                              if (x.collection && x.collection === getEnv('COLLECTION2')) {
                                toast.error('This collection is not allowed to be selected yet! Coming soon!');

                              } else {
                                send({
                                  type: 'SELECT_MONK',
                                  nft: {
                                    id: x.mint,
                                    imageUri: x.imageUri,
                                    monkeNumber: x.nftNumber,
                                  },
                                })
                              }

                            }
                            }
                          ></img>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {monkeSelected && (
              <div className="Profile__section">
                <h2 className="Profile__title">User Location</h2>
                <div className="Profile__location-switch">
                  <MDSwitch
                    checked={location.enabled}
                    setChecked={(checked) => {
                      if (!state.matches('findLocation')) {
                        send({
                          type: 'INPUT_LOCATION_ENABLED',
                          enabled: checked,
                          targetState: JSON.stringify(state.value),
                        });
                      }
                    }}
                  />
                  {state.matches('findLocation') ? (
                    <div className="Profile__location-switch-label ellipsis">
                      Finding location
                    </div>
                  ) : (
                    <div
                      className="Profile__location-switch-label"
                      onClick={() =>
                        send({
                          type: 'INPUT_LOCATION_ENABLED',
                          enabled: !location.enabled,
                          targetState: JSON.stringify(state.value),
                        })
                      }
                    >
                      {location.enabled
                        ? 'Show Monke on Map'
                        : 'Hide Monke on map'}
                    </div>
                  )}
                </div>
                <div className="Profile__location-info">
                  The selected location will be used to show a pin on the map
                  with your Monke and user information. This will let you and
                  other Monkes' see who is in the area!
                </div>
                {location.enabled && (
                  <div className="Profile__location-info">
                    By default if location access is granted your location is
                    set to your device's location. You can override this by
                    searching for a different location below.
                  </div>
                )}
                {location.enabled && (
                  <div className="Profile__form">
                    <MDDropdownSearch
                      disabled={!location.enabled}
                      label="Location"
                      placeholder="Search by address..."
                      onSearch={lookupPlaces}
                      onSelect={(v) =>
                        send({ type: 'INPUT_LOCATION', location: v })
                      }
                      selectedValue={location}
                      selectId={(v) => v.id}
                      mapTextValue={(val) => (val ? val.text : '')}
                    />
                  </div>
                )}
              </div>
            )}

            {monkeSelected && (
              <div className="Profile__section">
                <h2 className="Profile__title">User Information</h2>
                <div className="Profile__form">
                  <MDInput
                    error={nickNameError}
                    label="Nick Name *"
                    defaultValue={nickName}
                    onChange={(e) =>
                      send({
                        type: 'INPUT_NICK_NAME',
                        nickName: e.target.value,
                      })
                    }
                  />
                  <MDInput
                    label="Twitter"
                    defaultValue={twitter}
                    onChange={(e) =>
                      send({ type: 'INPUT_TWITTER', twitter: e.target.value })
                    }
                  />
                  <MDInput
                    label="Github"
                    defaultValue={github}
                    onChange={(e) =>
                      send({ type: 'INPUT_GITHUB', github: e.target.value })
                    }
                  />
                  <MDInput
                    label="Discord"
                    defaultValue={discord}
                    onChange={(e) =>
                      send({ type: 'INPUT_DISCORD', discord: e.target.value })
                    }
                  />
                  <MDInput
                    label="Telegram"
                    defaultValue={telegram}
                    onChange={(e) =>
                      send({ type: 'INPUT_TELEGRAM', telegram: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {state.matches('display') && (
              <button
                className="Profile__delete button button--delete"
                onClick={() => send('DELETE')}
              >
                Delete User
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
};
