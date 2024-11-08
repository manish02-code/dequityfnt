import React, { useState, useEffect } from 'react';
import './DataCollector.css';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBFile,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { mnemonicGenerate, mnemonicToMiniSecret, cryptoWaitReady } from '@polkadot/util-crypto';
import { encodeAddress, decodeAddress } from '@polkadot/util-crypto';
import { u8aToHex, stringToU8a, hexToU8a, u8aToString } from '@polkadot/util';
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { useNavigate } from "react-router-dom"



export default function DataCollector() {
  const [GifULR, setGifURL] = useState("https://www.clipartbest.com/cliparts/dTr/6aA/dTr6aAxnc.gif")
  const [addRecordStatus, setaddRecordStatus] = useState(' ')
  const [uploadLoading, setuploadLoading] = useState(false)

  const [host, setHost] = useState("");
  const [port, setPort] = useState(22);
  const [paraId, setParaId] = useState(null);
  const [username, setUsername] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [accountCreatModal, setaccountCreatModal] = useState(false);
  const [accountCreatModal3, setaccountCreatModal3] = useState(false);

  const [sendModal, setSendModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [mnemonic, setMnemonic] = useState('');
  const [userMnemonic, setUserMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [amount, setAmount] = useState('');


  const [cntNodeIp, setcntNodeIp] = useState("")

  const accountCreatModalToggle = () => setaccountCreatModal(!accountCreatModal);
  const accountCreatModalToggle3 = () => setaccountCreatModal3(!accountCreatModal3);

  const sendModalToggle = () => setSendModal(!sendModal);

  const addrecordmodal = () => {

    setGifURL("https://www.clipartbest.com/cliparts/dTr/6aA/dTr6aAxnc.gif")
    setaddRecordStatus(" ")
    setuploadLoading(!uploadLoading)
    setAlertMessage('')
    setStatusMessage('')

  };



  const navigate = useNavigate();

  console.log("Env testninng: ", process.env.REACT_APP_SECRET_NAME
  )


  useEffect(() => {
    const ws = new WebSocket(`${process.env.REACT_APP_BACKEND_SERVER_WEBSOCKET}`);

    ws.onopen = () => {
      setStatusMessage('working')

    };

    ws.onmessage = (event) => {
      setStatusMessage(event.data);
      setaddRecordStatus(event.data)
    };

    ws.onclose = () => {
      setStatusMessage('Disconnected from WebSocket server');
      setaddRecordStatus("Disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setuploadLoading(true)

    try {
      if (!host || !paraId || !port || !username) {
        setAlertMessage("Please fill in all required fields.");
        setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif");
        setLoading(false);
        setuploadLoading(false);
        return;
      }

      if (/\s/.test(host) || /\s/.test(paraId) || /\s/.test(port) || /\s/.test(username)) {
        setAlertMessage("Fields should not contain spaces.");
        setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif");
        setLoading(false);
        setuploadLoading(false);
        console.log("contain Spaces")
        return;
      }
      if (selectedFile) {
        const formData = new FormData();
        formData.append('host', host);
        formData.append('paraid', paraId);
        formData.append('port', port);
        formData.append('username', username);
        formData.append('privateKey', selectedFile);

        const response = await axios.post(`${process.env.REACT_APP_BACKEND_SERVER}/para/parachain`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setAlertMessage(response.data.message);
        setGifURL("https://cdn.dribbble.com/users/147386/screenshots/5315437/success-tick-dribbble.gif")
      } else {
        setAlertMessage("Please select a file");
      }
    } catch (error) {
      console.error(error);
      setAlertMessage(error.response?.data?.message || "An error occurred");
      setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")

    } finally {
      setLoading(false);
    }
  };

  const generateMnemonic = () => {
    const mnemonic = mnemonicGenerate();
    setMnemonic(mnemonic);
    setModalStep(2);
  };

  const confirmMnemonic = () => {
    if (userMnemonic !== mnemonic) {
      setAlertMessage("Mnemonics do not match. Please try again.");
    } else {
      setModalStep(3);
    }
  };

  const handlePasswordSubmit = async () => {
    if (password !== confirmPassword) {
      setAlertMessage("Passwords do not match. Please try again.");
      return;
    }

    try {
      await cryptoWaitReady();
      const miniSecret = mnemonicToMiniSecret(mnemonic, password);
      const encoded = u8aToHex(miniSecret);
      localStorage.setItem('encryptedMnemonic', encoded);

      setAlertMessage("Account created and saved successfully.");
      setaccountCreatModal(false);
    } catch (error) {
      console.error(error);
      setAlertMessage("An error occurred during encryption.");
    }
  };

  const handleSend = async () => {
    try {
      await cryptoWaitReady();
      const storedMnemonic = localStorage.getItem('encryptedMnemonic');
      const miniSecret = hexToU8a(storedMnemonic);
      const keyring = new Keyring({ type: 'sr25519' });
      const sender = keyring.addFromSeed(miniSecret);

      const wsProvider = new WsProvider(process.env.REACT_APP_RELAY);
      const api = await ApiPromise.create({ provider: wsProvider });

      const transfer = api.tx.balances.transferAllowDeath(receiverAddress, amount);
      const hash = await transfer.signAndSend(sender);

      setAlertMessage(`Transfer successful with hash: ${hash}`);
      setSendModal(false);
    } catch (error) {
      console.error(error);
      setAlertMessage("An error occurred during the transfer.");
    }
  };




  const ReserveParaId = async () => {
    try {
      const keyring = new Keyring({ type: 'sr25519' });
      const alice = keyring.addFromUri('//Alice');


      const wsProvider = new WsProvider(process.env.REACT_APP_RELAY);
      const api = await ApiPromise.create({ provider: wsProvider });

      const freerevrpara = await api.query.registrar.nextFreeParaId()
      setParaId(freerevrpara.toPrimitive())


      const transfer = api.tx.registrar.reserve();
      console.log(transfer.toPrimitive())


      const hash = await transfer.signAndSend(alice);
      console.log(hash.toPrimitive())

    } catch (error) {
      console.log(error)

    }
  }








  const handleClick = async () => {
    try {


      navigate(`/DataCollector/Dashbord`)



    } catch (error) {
      console.log(error)

    }
  }

  return (
    <div className="page-container">
      <div>
        <MDBCard className='my-4' style={{ maxWidth: '1200px', margin: 'auto', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <MDBRow className='g-0'>
            <MDBCol md='8' className="d-none d-md-block">
              <div className='mask rounded-5'></div>
              <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
                <MDBCardBody className='px-5'>
                  <h2 className="text-uppercase text-center mb-5">Create Your Blockchain</h2>
                  <MDBInput wrapperClass='mb-4' label='Host Name' size='lg' type='text' value={host} onChange={(e) => setHost(e.target.value)} />
                  <MDBInput wrapperClass='mb-4' label='Port Number' size='lg' type='number' value={port} onChange={(e) => setPort(e.target.value)} />
                  {/* <MDBInput wrapperClass='mb-4' label='Allocated ParaId' size='lg' type='number' value={paraId} onChange={(e) => setParaId(e.target.value)} /> */}

                  {paraId == null ? (

                    <div className="mb-4">
                      <MDBBtn
                        color='dark'
                        wrapperClass='mb-4'
                        onClick={ReserveParaId}

                      >
                        Reserve ParaId
                      </MDBBtn>
                    </div>

                  ) : (

                    <MDBInput
                      label={paraId}
                      placeholder="Allocated ParaId"
                      id="formControlReadOnly"
                      type="text"
                      readonly
                      wrapperClass='mb-4'
                    />


                  )}

                  <MDBInput wrapperClass='mb-4' label='UserName' size='lg' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                  <MDBFile wrapperClass='mb-4' onChange={handleFileChange} size='lg' id='customFile' />
                  <MDBRow>
                    <MDBCol>
                      <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg' onClick={handleSubmit} disabled={loading} style={{ marginTop: '20px', marginBottom: '20px' }}>
                        {loading ? "Createting Chain" : "Create Chain"}
                      </MDBBtn>
                    </MDBCol>
                    <MDBCol>
                      <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg' onClick={handleClick} disabled={loading} style={{ marginTop: '20px', marginBottom: '20px' }}>
                        Connect To Chain
                      </MDBBtn>
                    </MDBCol>
                  </MDBRow>
                  {alertMessage && <div className="alert-message">{alertMessage}</div>}
                  {statusMessage && <div className="status-message">{statusMessage}</div>}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </div>



      <MDBModal tabIndex='-1' open={accountCreatModal} onClose={() => setaccountCreatModal(false)}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Account Setup</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={accountCreatModalToggle}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {modalStep === 1 && (
                <div>
                  <p>Click the button below to generate a new mnemonic phrase.</p>
                  <MDBBtn onClick={generateMnemonic}>Generate Mnemonic</MDBBtn>
                </div>
              )}
              {modalStep === 2 && (
                <div>
                  <p>Your generated mnemonic is:</p>
                  <p><strong>{mnemonic}</strong></p>
                  <MDBInput
                    wrapperClass='mb-4'
                    label='Confirm Mnemonic'
                    size='lg'
                    type='text'
                    value={userMnemonic}
                    onChange={(e) => setUserMnemonic(e.target.value)}
                  />
                  <MDBBtn onClick={confirmMnemonic}>Confirm Mnemonic</MDBBtn>
                </div>
              )}
              {modalStep === 3 && (
                <div>
                  <MDBInput
                    wrapperClass='mb-4'
                    label='Password'
                    size='lg'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <MDBInput
                    wrapperClass='mb-4'
                    label='Confirm Password'
                    size='lg'
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <MDBBtn onClick={handlePasswordSubmit}>Submit</MDBBtn>
                </div>
              )}
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      <MDBModal tabIndex='-1' open={sendModal} onClose={() => setSendModal(false)}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Send Funds</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={sendModalToggle}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                wrapperClass='mb-4'
                label='Receiver Address'
                size='lg'
                type='text'
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
              />
              <MDBInput
                wrapperClass='mb-4'
                label='Amount'
                size='lg'
                type='number'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <MDBBtn onClick={handleSend}>Send</MDBBtn>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>




      {uploadLoading ? (
        <>

          <MDBModal staticBackdrop open={uploadLoading} tabIndex='-1'>
            <MDBModalDialog >
              <MDBModalContent>
                <MDBModalHeader>
                  <MDBModalTitle></MDBModalTitle>
                  {/* <MDBBtn className='btn-close' color='none' onClick={addrecordmodal}></MDBBtn> */}
                </MDBModalHeader>
                <MDBModalBody>
                  <div>
                    <h3 style={{ fontSize: '1.5rem' }}>{addRecordStatus}</h3>
                    <figure className='figure'>
                      <img
                        src={GifULR}
                        className='figure-img img-fluid rounded shadow-3 mb-3'
                        alt='...'
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </figure>
                  </div>

                </MDBModalBody>

                <MDBModalFooter>
                  <MDBBtn color='danger' onClick={addrecordmodal} >
                    {loading ? "Cancel" : "Close"}
                  </MDBBtn>
                  <MDBBtn color='sucess' disabled={loading} onClick={handleClick} >
                    Conntect to Chain
                  </MDBBtn>
                </MDBModalFooter>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>
        </>
      ) : null}


    </div>
  );
}
