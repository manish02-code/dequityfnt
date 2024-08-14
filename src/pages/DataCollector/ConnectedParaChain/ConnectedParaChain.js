
import React from "react";

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
    MDBCardImage,
    MDBCheckbox,
    MDBTextArea,
    MDBIcon
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { useState, useEffect } from "react";


import { ApiPromise, WsProvider } from '@polkadot/api';
import { encodeAddress, mnemonicGenerate } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/keyring';

import { Html5QrcodeScanner } from "html5-qrcode";



export default function ConnectedCollector() {
    const [copyStatusImage, setcopyStatusImage] = useState("https://static.vecteezy.com/system/resources/previews/015/805/731/original/copy-paste-symbol-sign-document-file-copy-duplicate-paste-archive-icon-free-vector.jpg")
    const [copyStatusImage2, setcopyStatusImage2] = useState("https://static.vecteezy.com/system/resources/previews/015/805/731/original/copy-paste-symbol-sign-document-file-copy-duplicate-paste-archive-icon-free-vector.jpg")
    const [copyStatusImage3, setcopyStatusImage3] = useState("https://static.vecteezy.com/system/resources/previews/015/805/731/original/copy-paste-symbol-sign-document-file-copy-duplicate-paste-archive-icon-free-vector.jpg")
    const [copyStatusImage4, setcopyStatusImage4] = useState("https://static.vecteezy.com/system/resources/previews/015/805/731/original/copy-paste-symbol-sign-document-file-copy-duplicate-paste-archive-icon-free-vector.jpg")
    const [copyStatusImage5, setcopyStatusImage5] = useState("https://static.vecteezy.com/system/resources/previews/015/805/731/original/copy-paste-symbol-sign-document-file-copy-duplicate-paste-archive-icon-free-vector.jpg")
    const [GifULR, setGifURL] = useState("https://www.clipartbest.com/cliparts/dTr/6aA/dTr6aAxnc.gif")
    const [addRecordStatus, setaddRecordStatus] = useState(' ')
    const [uploadLoading, setuploadLoading] = useState(false)

    const [ChainID, setChainID] = useState()
    const [parachianConnectionStatus, setparachianConnectionStatus] = useState(false)
    const [parachianRegisterStatus, setparachianRegisterStatus] = useState(false)
    const [sovereignAccount, setsovereignAccount] = useState('')
    const [sudoAccount, setSudoAccout] = useState('')

    const [QRcodedata, setQRcodedata] = useState('No result');



    const [accountCreatModal3, setaccountCreatModal3] = useState(false);
    const [cntNodeIp, setcntNodeIp] = useState("")
    const [cntNodePort, setcntNodePort] = useState(8844)
    const accountCreatModalToggle3 = () => {

        setaccountCreatModal3(!accountCreatModal3);

    }
    ///Creat Participant Profile
    const [Participantname, setParticipantname] = useState("")
    const [Participantage, setParticipantage] = useState(null)
    const [Participantgender, setParticipantgender] = useState("")
    const [Participantethnicity, setParticipantethnicity] = useState("")
    const [ParticipantaccountID, setParticipantaccountID] = useState("dfsdfsdf")
    const [perticipentModal, setperticipentModal] = useState(false);

    const CreateParticipent = () => {
        setParticipantname(" ")
        setParticipantage(null)
        setParticipantgender(" ")
        setParticipantethnicity(" ")
        setParticipantaccountID(" ")
        setperticipentModal(!perticipentModal)
    };


    const addrecordmodal = () => {
        setuploadLoading(!uploadLoading)
        setGifURL("https://www.clipartbest.com/cliparts/dTr/6aA/dTr6aAxnc.gif")
        setaddRecordStatus(" ")
        setFile(null)
        setdepositedAccount(' ')
        setRSApublicKey(' ')
        sethasCID('')
        setPerticipentEncyKey('')
        setScrollableModal(false)

    };

    const createsetParticipant = async () => {
        addrecordmodal()
        setaddRecordStatus("Creating Participant")
        const encodedCallData = getEncodedCallData(Participantname, Participantage, Participantgender, Participantethnicity, ParticipantaccountID)

        const encodedCallDataHex = await createXcmCall(encodedCallData);

    }


    /////////////////////////////////////////////////////
    //QRcode Scanning Part




    /////////////////////////////////////////////////////
    const [file, setFile] = useState(null);
    const [RSApublicKey, setRSApublicKey] = useState('')
    const [depositedAccount, setdepositedAccount] = useState('')
    const [PerticipentEncyKey, setPerticipentEncyKey] = useState('')
    const [hasCID, sethasCID] = useState('')
    const [scrollableModal, setScrollableModal] = useState(false);

    const depositeData = async (hasCID, PerticipentEncyKey) => {

        console.log("CID: ", hasCID, "ENkey: ", PerticipentEncyKey)


        addrecordmodal()
        setaddRecordStatus("Depositing Data..")


        console.log(PerticipentEncyKey, hasCID, depositedAccount)
        const encodedCallData = await getDeositdataEncodedCallData(PerticipentEncyKey, hasCID, depositedAccount)
        console.log(encodedCallData)

        const encodedCallDataHex = await createXcmCall(encodedCallData);

    }


    ///This is use to take Raw file form User
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };


    const IPFSUplod2 = async (e) => {
        e.preventDefault();

        setScrollableModal(false)
        setuploadLoading(true)

        try {
            console.log(RSApublicKey)
            if (file) {
                const formData = new FormData();
                formData.append('RSAKey', RSApublicKey);
                formData.append('ReportFile', file);

                await axios.post(`http://${process.env.REACT_APP_BACKEND_SERVER}/IpfsKEys/UploadIPFS`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }).then(async response => {
                    setaddRecordStatus(response.data.message);





                    const encKey = response.data.encryptionKey;
                    const CId = response.data.result.IpfsHash;

                    setPerticipentEncyKey(encKey)
                    sethasCID(CId)



                    await depositeData(CId, encKey)
                })

            } else {
                setaddRecordStatus("Please select a file");
                setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")
            }
        } catch (error) {
            console.error(error);
            setaddRecordStatus(error.response?.data?.message || "An error occurred");
            setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")

        }
    };





    const conn = async () => {
        try {

            const wsProvider = new WsProvider(`ws://${cntNodeIp}:${cntNodePort}`); // Replace with your endpoint
            let api = await ApiPromise.create({ provider: wsProvider });

          

            setparachianConnectionStatus(true)


            const paraid = await api.query.parachainInfo.parachainId()
            setChainID(paraid.toPrimitive())
            console.log("Connected to you node",paraid.toPrimitive())

            checkParachainStatus(paraid.toPrimitive())




            const sudoacct = await api.query.sudo.key()
            setSudoAccout(sudoacct.toPrimitive())

            const params = {
                paraid: paraid.toPrimitive()
            };

        
            axios.post(`http://${process.env.REACT_APP_BACKEND_SERVER}/para/getSovereignAccount`, params)
                .then(response => {
                    setsovereignAccount(response.data);
                    console.log("FEcthing sovereign Accounts",response.data)

                })
                .catch(error => {
                    console.error(error);
                });

                console.log("FEcthing sovereign Accounts",sovereignAccount)
            const data = await api.query.system.account(sovereignAccount);
            console.log(data.data.toString())


            accountCreatModalToggle3()

            return (api)

        } catch (error) {
            console.error("Error fetching offer details:", error);
            setparachianConnectionStatus(false)
        }

    }


    async function getEncodedCallData(Participantname, Participantage, Participantgender, Participantethnicity, ParticipantaccountID) {
        const wsProvider = new WsProvider(process.env.REACT_APP_RELAY); 
        let api = await ApiPromise.create({ provider: wsProvider });

        const call = await api.tx.hrmp.createParticipantProfileXcm(Participantname, Participantage, Participantgender, Participantethnicity, ParticipantaccountID);

        // Get the encoded call data
        let encodedCallData = call.toHex();

        console.log("Encoded Call Data (not modified): ", encodedCallData);

        return removeBefore3c(encodedCallData);
    }







    async function getDeositdataEncodedCallData(ParticipantEnKey, ParticipantIpfsCid, ParticipantaccountID) {
        const wsProvider = new WsProvider(process.env.REACT_APP_RELAY); // Replace with your endpoint
        let api = await ApiPromise.create({ provider: wsProvider });


        // Create the extrinsic call
        const call = await api.tx.hrmp.depositeDataPWalletXcm(ParticipantEnKey, ParticipantIpfsCid, ParticipantaccountID);

        // Get the encoded call data
        let encodedCallData = call.toHex();

        console.log("Encoded Call Data (not modified): ", encodedCallData);


        return removeBefore3c(encodedCallData);
    }






    async function removeBefore3c(encodedCallData) {
        const encodedCallDataStr = await encodedCallData;

        const index = encodedCallDataStr.indexOf('3c');
        if (index) {
            return '0x' + encodedCallDataStr.substring(index);
        } else {
            throw new Error('"3c" not found in the encoded call data');
        }
    }









    async function createXcmCall(encodedCallData) {
        try {
            const endcalldata = await encodedCallData;
            console.log('Encoded Call Data:', endcalldata);

            const wsProvider = new WsProvider(`ws://${cntNodeIp}:${cntNodePort}`);
            const api = await ApiPromise.create({ provider: wsProvider });

            const dest = {
                "V2": {
                    "parents": 1,
                    "interior": "Here"
                }
            };

            const messages = {
                "V2": [
                    {
                        "WithdrawAsset": [
                            {
                                "id": {
                                    "Concrete": {
                                        "parents": 0,
                                        "interior": "Here"
                                    }
                                },
                                "fun": {
                                    "Fungible": 1000000000000
                                }
                            }
                        ]
                    },
                    {
                        "BuyExecution": {
                            "fees": {
                                "id": {
                                    "Concrete": {
                                        "parents": 0,
                                        "interior": "Here"
                                    }
                                },
                                "fun": {
                                    "Fungible": 1000000000000
                                }
                            },
                            "weightLimit": "Unlimited"
                        }
                    },
                    {
                        "Transact": {
                            "originType": "Native",
                            "requireWeightAtMost": 40000000000,
                            "call": {
                                "encoded": endcalldata
                            }
                        }
                    },
                    { "RefundSurplus": {} },
                    {
                        "DepositAsset": {
                            "assets": {
                                "Wild": "All"
                            },
                            "maxAssets": 1,
                            "beneficiary": {
                                "parents": 0,
                                "interior": {
                                    "X1": {
                                        "Parachain": ChainID
                                    }
                                }
                            }
                        }
                    }
                ]
            };

            const keyring = new Keyring({ type: 'sr25519' });
            const alice = keyring.addFromUri(process.env.ALICE_URI || '//Alice');

            const xcmCall = api.tx.polkadotXcm.send(dest, messages);
            setaddRecordStatus('Sending Transection');

            const unsub = await api.tx.sudo.sudo(xcmCall).signAndSend(alice, { nonce: -1 }, ({ status, events, dispatchError }) => {
                if (status.isInBlock) {
                    console.log(`Transaction included at blockHash ${status.asInBlock}`);
                    setaddRecordStatus("Transaction Include in Block")
                } else if (status.isFinalized) {
                    console.log(`Transaction finalized at blockHash ${status.asFinalized}`);
                    setaddRecordStatus("Transaction finalized")
                    setGifURL("https://cdn.dribbble.com/users/147386/screenshots/5315437/success-tick-dribbble.gif")
                    unsub();
                } else {
                    console.log(`Transaction status: ${status.type}`);
                    setaddRecordStatus(`Transaction status: ${status.type}`)

                }


                if (dispatchError) {
                    if (dispatchError.isModule) {
                        const decoded = api.registry.findMetaError(dispatchError.asModule);
                        const { documentation, name, section } = decoded;
                        console.error(`Error: ${section}.${name}: ${documentation.join(' ')}`);
                        setaddRecordStatus("Something is Worong")
                        setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")
                    } else {
                        console.error(`Error: ${dispatchError.toString()}`);
                        setaddRecordStatus("Something is Worong")
                        setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")
                    }
                }

                events.forEach(({ event: { method, section }, phase, event }) => {
                    console.log(`\t${phase.toString()}: ${section}.${method}:: ${event.data.toString()}`);
                });
            });

        } catch (error) {
            console.error('Error creating XCM call:', error);
            setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")
        }
    }



    async function sendXcmCall(encodedCallDataHex) {
        try {
            const wsProvider = new WsProvider(`ws://${cntNodeIp}:${cntNodePort}`);
            const api = await ApiPromise.create({ provider: wsProvider });

            const keyring = new Keyring({ type: 'sr25519' });
            const alice = keyring.addFromUri('//Alice');

            // Create the call from the encoded data
            const call = api.tx(encodedCallDataHex);

            console.log('Created call from encoded data:', call.toHuman());

            // Sign and send the transaction
            const hash = await call.signAndSend(alice);

            console.log('Transaction sent with hash:', hash.toHex());
        } catch (error) {
            console.error('Error sending XCM call:', error);
        }
    }




    /////////////////////////////////////////////////////////////////////////////////////////
    //               New Account Logic

    const [modalStep, setModalStep] = useState(1);
    const [mnemonic, setMnemonic] = useState('');
    const [userMnemonic, setUserMnemonic] = useState('');
    const [alertMessage, setAlertMessage] = useState("");
    const [accountCreatModal, setaccountCreatModal] = useState(false);
    const [RSApublic, setRSApublic] = useState(``);
    const [RSAprivet, setRSAprivet] = useState(``);
    const [checked, setChecked] = useState(false);



    const accountCreatModalToggle = () => {

        setAlertMessage("Account created and saved successfully.");
        setaccountCreatModal(false);
        setModalStep(1)
        setMnemonic('')
        setUserMnemonic('')
        setRSApublic('')
        setRSAprivet('')
        setChecked(false)
        setAlertMessage('')

        setcopyStatusImage("https://static.vecteezy.com/system/resources/previews/015/805/731/original/copy-paste-symbol-sign-document-file-copy-duplicate-paste-archive-icon-free-vector.jpg")
        setcopyStatusImage2("https://static.vecteezy.com/system/resources/previews/015/805/731/original/copy-paste-symbol-sign-document-file-copy-duplicate-paste-archive-icon-free-vector.jpg")
        setcopyStatusImage3("https://static.vecteezy.com/system/resources/previews/015/805/731/original/copy-paste-symbol-sign-document-file-copy-duplicate-paste-archive-icon-free-vector.jpg")
        setcopyStatusImage4("https://static.vecteezy.com/system/resources/previews/015/805/731/original/copy-paste-symbol-sign-document-file-copy-duplicate-paste-archive-icon-free-vector.jpg")
        setcopyStatusImage5("https://static.vecteezy.com/system/resources/previews/015/805/731/original/copy-paste-symbol-sign-document-file-copy-duplicate-paste-archive-icon-free-vector.jpg")


        setaccountCreatModal(!accountCreatModal)
    };


    const RsaNext = async () => {
        setModalStep(3);
        setAlertMessage('')
        setaccountCreatModal(false)


    }




    const generateMnemonic = () => {
        const mnemonic = mnemonicGenerate();
        setMnemonic(mnemonic);
        const keyring = new Keyring({ type: 'sr25519' });
        const pair = keyring.addFromUri(mnemonic);
        setParticipantaccountID(pair.address)
        setModalStep(2);
        setAlertMessage('')
    };




    const confirmMnemonic = async () => {
        if (userMnemonic !== mnemonic) {
            setAlertMessage("Mnemonics do not match. Please try again.");
        } else {
            try {
                const res = await axios.get(`http://${process.env.REACT_APP_BACKEND_SERVER}/IpfsKEys/CreateRSAkeys`);
                setRSAprivet(res.data.privateKey);
                setRSApublic(res.data.publicKey);
                setModalStep(3);
                setAlertMessage('')
            } catch (error) {
                console.error('Error fetching data:', error);
            }

        }
    };


    const checkParachainStatus = async (ChainID) => {
        try {
            // Connect to the relay chain node
            const wsProvider = new WsProvider(process.env.REACT_APP_RELAY); // Replace with your endpoint
            const api = await ApiPromise.create({ provider: wsProvider });

            // Query the list of registered parachains
            const parachains = await api.query.paras.parachains();
            console.log('Registered Parachains:', parachains.toPrimitive())
            const parachain = parachains.toPrimitive()

            const isParachainRegistered = parachain.includes(ChainID);



            console.log(`Parachain  registered: `, isParachainRegistered);
            setparachianRegisterStatus(isParachainRegistered)

            if (isParachainRegistered) {
                console.log(`Parachain ${ChainID} is registered.`);
            } else {
                console.error(`Parachain ${ChainID} is not registered.`);
            }
        } catch (error) {
            console.error(`Error checking parachain status: ${error.message}`);
        }
    };






    const DecrytpDId = async (value) => {
        try {
            const res = await axios.get(`http://${process.env.REACT_APP_BACKEND_SERVER}/IpfsKEys/DecrytpDId`, {
                params: {
                    DepositeId: value
                }
            });

            const splitData = res.data.split("::");
            console.log("Decrypted Data:", splitData);
            setdepositedAccount(splitData[0])
            setRSApublicKey(splitData[1])


                  {/* <MDBInput style={{ marginBottom: '20px' }} label="Account ID" value={depositedAccount} onChange={(e) => setdepositedAccount(e.target.value)} id="form1" type="text" />

                            <MDBTextArea style={{ marginBottom: '20px' }} label="RSA Public Key" value={RSApublicKey} onChange={(e) => setRSApublicKey(e.target.value)} id="textAreaExample" /> 
                            */}


        } catch (error) {
            console.log(error)

        }

    }

    const QrCodeScanner = ({ isOpen, onClose }) => {
        const [scanResult, setScanResult] = useState(null);
    
        useEffect(() => {
            if (isOpen) {
                const scanner = new Html5QrcodeScanner('reader', {
                    qrbox: {
                        width: 250,
                        height: 250,
                    },
                    fps: 5,
                });
    
                const onScanSuccess = (result) => {
                    scanner.clear();
                    setScanResult(result);
                    DecrytpDId(result)
       
                   return result;
                };
    
                const onScanError = (err) => {
                    console.warn(err);
                };
    
                scanner.render(onScanSuccess, onScanError);
    
                return () => {
                    scanner.clear();
                };
            }
        }, [isOpen]);
    
        return (
            <div>
                <p>Scan your QR code</p>
                {scanResult ? <div>Data: {scanResult}</div> : <div id="reader"></div>}
            </div>
        );
    };
    

    





    useEffect(() => {

        const fetchData = async () => {
            if (parachianConnectionStatus === false) {
                await accountCreatModalToggle3();
            }
        };

        fetchData();



        return () => {
            // Cleanup code here if necessary
        };
    }, [parachianConnectionStatus]); // Add any dependencies if needed



    return (<>

        <div className="page-container">
            <div>
                <MDBCard
                    className='my-4'
                    style={{
                        maxWidth: '1200px',
                        margin: 'auto',
                        borderRadius: '10px',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        paddingTop: '20px',  // Add top padding here
                        paddingLeft: '20px'  // Add left padding here
                    }}
                >
                    <MDBRow className='g-0'>
                        <MDBCol lg="5">
                            <MDBCard className="mb-4" style={{
                                border: '1px solid rgba(0, 0, 0, 0.1)',  // Add solid border here
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' // Add shadow here
                            }}>
                                <MDBCardBody className="text-center">


                                    {parachianConnectionStatus ? (<div
                                        style={{
                                            backgroundColor: `#B9EDCB`,
                                            borderRadius: '10px',
                                            padding: '10px',
                                            marginTop: '10px'
                                        }}
                                    >
                                        <p className="text-muted mb-1">
                                            Connected {ChainID}
                                        </p>
                                        <p className="text-muted mb-1"></p>
                                    </div>) : (<div
                                        style={{
                                            backgroundColor: `#FB5558`,
                                            borderRadius: '10px',
                                            padding: '10px',
                                            marginTop: '10px'
                                        }}
                                    >
                                        <p className="text-muted mb-1">
                                            Disconnected {ChainID}
                                        </p>
                                        <p className="text-muted mb-1"></p>
                                    </div>

                                    )}




                                    {parachianRegisterStatus ? (<div
                                        style={{
                                            backgroundColor: `#B9EDCB`,
                                            borderRadius: '10px',
                                            padding: '10px',
                                            marginTop: '10px'
                                        }}
                                    >
                                        <p className="text-muted mb-1">
                                            Register
                                        </p>
                                        <p className="text-muted mb-1"></p>
                                    </div>) : (<div
                                        style={{
                                            backgroundColor: `#FB5558`,
                                            borderRadius: '10px',
                                            padding: '10px',
                                            marginTop: '10px'
                                        }}
                                    >
                                        <p className="text-muted mb-1">
                                            Not Register,Please wait 5-10 minutes for registration
                                        </p>
                                        <p className="text-muted mb-1"></p>
                                    </div>

                                    )}





                                    <div
                                        style={{
                                            backgroundColor: '#eee',
                                            borderRadius: '10px',
                                            padding: '10px',
                                            marginTop: '10px'
                                        }}
                                    >
                                        <p className="text-muted mb-1">Balance: ABCdfsdfsd DQT</p>
                                        <p className="text-muted mb-1"></p>
                                    </div>

                                    <div
                                        style={{
                                            backgroundColor: '#eee',
                                            borderRadius: '10px',
                                            padding: '10px',
                                            marginTop: '10px',
                                            position: 'relative'
                                        }}
                                    >
                                        <p className="text-muted mb-1">Sovereign Account: </p>
                                        <p className="text-muted mb-1">{sovereignAccount}</p>

                                        <button
                                            className="btn btn-secondary btn-sm"
                                            style={{
                                                position: 'absolute',
                                                bottom: '5px',
                                                right: '5px',
                                                marginTop: '10px'
                                            }}
                                            onClick={() => {
                                                navigator.clipboard.writeText(sovereignAccount);
                                                setcopyStatusImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpyPyEOzpIz1YAp9NEt84w7-gGaEkuwQ0jgMa7_OBpvlE_pMoC6kiQiHthu-yu1ffHs7o&usqp=CAU")
                                            }}
                                        >
                                            <figure
                                                className='figure'
                                                style={{
                                                    width: '30px',
                                                    height: '30px',
                                                    margin: '0'
                                                }}
                                            >
                                                <img
                                                    src={copyStatusImage}
                                                    className='figure-img img-fluid rounded shadow-3 mb-3'
                                                    alt='...'
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </figure>
                                        </button>
                                    </div>

                                    <div
                                        style={{
                                            backgroundColor: '#eee',
                                            borderRadius: '10px',
                                            padding: '10px',
                                            marginTop: '10px',
                                            position: 'relative'
                                        }}
                                    >
                                        <p className="text-muted mb-1">Sudo Account: </p>
                                        <p className="text-muted mb-1">{sudoAccount}</p>

                                        <button
                                            className="btn btn-secondary btn-sm"
                                            style={{
                                                position: 'absolute',
                                                bottom: '5px',
                                                right: '5px',
                                                marginTop: '10px'
                                            }}
                                            onClick={() => {
                                                navigator.clipboard.writeText(sudoAccount);
                                                setcopyStatusImage2("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpyPyEOzpIz1YAp9NEt84w7-gGaEkuwQ0jgMa7_OBpvlE_pMoC6kiQiHthu-yu1ffHs7o&usqp=CAU")
                                            }}
                                        >
                                            <figure
                                                className='figure'
                                                style={{
                                                    width: '30px',
                                                    height: '30px',
                                                    margin: '0'
                                                }}
                                            >
                                                <img
                                                    src={copyStatusImage2}
                                                    className='figure-img img-fluid rounded shadow-3 mb-3'
                                                    alt='...'
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </figure>
                                        </button>
                                    </div>

                                    <div
                                        style={{
                                            backgroundColor: '#eee',
                                            borderRadius: '10px',
                                            padding: '10px',
                                            marginTop: '10px',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <div>
                                            <MDBBtn size="lg" rounded disabled={!parachianRegisterStatus} className='bg-warning' onClick={CreateParticipent}>
                                                Create Participant
                                            </MDBBtn>
                                        </div>
                                        <div>
                                            <MDBBtn size="lg" rounded className='bg-success' onClick={() => setScrollableModal(true)}>
                                                Deposite Data
                                            </MDBBtn>
                                        </div>
                                    </div>


                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBCard>
            </div>

            <MDBModal staticBackdrop tabIndex='-1' open={accountCreatModal3} onClose={() => setaccountCreatModal3(false)}>
                <MDBModalDialog centered>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Enter Detail </MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={accountCreatModalToggle3}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Enter your Node IP Address'
                                size='lg'
                                type='text'
                                value={cntNodeIp}
                                onChange={(e) => setcntNodeIp(e.target.value)}
                            />
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Enter your Node Port number'
                                size='lg'
                                type='number'
                                value={cntNodePort}
                                onChange={(e) => setcntNodePort(e.target.value)}
                            />
                            <MDBBtn onClick={conn}>Connect</MDBBtn>
                        </MDBModalBody>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>




            <MDBModal staticBackdrop tabIndex='-1' open={perticipentModal} onClose={() => setperticipentModal(false)}>
                <MDBModalDialog centered>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Enter Detail </MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={CreateParticipent}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Name'
                                size='lg'
                                type='text'
                                value={Participantname}
                                onChange={(e) => setParticipantname(e.target.value)}
                            />
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Age'
                                size='lg'
                                type='Number'
                                value={Participantage}
                                onChange={(e) => setParticipantage(e.target.value)}
                            />

                            <MDBInput
                                wrapperClass='mb-4'
                                label='Gender'
                                size='lg'
                                type='text'
                                value={Participantgender}
                                onChange={(e) => setParticipantgender(e.target.value)}
                            />
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Ethnicity'
                                size='lg'
                                type='text'
                                value={Participantethnicity}
                                onChange={(e) => setParticipantethnicity(e.target.value)}
                            />

                            {ParticipantaccountID == " " ? (

                                <div className="mb-4">
                                    <MDBBtn
                                        color='dark'
                                        wrapperClass='mb-4'
                                        onClick={accountCreatModalToggle}

                                    >
                                        Create Accouont ID
                                    </MDBBtn>
                                </div>

                            ) : (

                                <MDBInput
                                    label={ParticipantaccountID}
                                    placeholder="Readonly input here..."
                                    id="formControlReadOnly"
                                    type="text"
                                    readonly
                                    wrapperClass='mb-4'
                                />


                            )}



                            <MDBBtn disabled={ParticipantaccountID == " "} onClick={createsetParticipant}>Create Account</MDBBtn>
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
                                    <MDBBtn className='btn-close' color='none' onClick={addrecordmodal}></MDBBtn>
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
                                        Cancel
                                    </MDBBtn>
                                </MDBModalFooter>
                            </MDBModalContent>
                        </MDBModalDialog>
                    </MDBModal>
                </>
            ) : null}





            <MDBModal staticBackdrop tabIndex='-1' open={accountCreatModal} onClose={() => setaccountCreatModal(false)}>
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
                                    <div style={{ position: 'relative' }}>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            style={{
                                                position: 'absolute',
                                                bottom: '5px',
                                                right: '5px',
                                                marginTop: '10px'
                                            }}
                                            onClick={() => {
                                                navigator.clipboard.writeText(mnemonic);
                                                setcopyStatusImage3("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpyPyEOzpIz1YAp9NEt84w7-gGaEkuwQ0jgMa7_OBpvlE_pMoC6kiQiHthu-yu1ffHs7o&usqp=CAU");
                                            }}
                                        >
                                            <figure
                                                className='figure'
                                                style={{
                                                    width: '30px',
                                                    height: '30px',
                                                    margin: '0'
                                                }}
                                            >
                                                <img
                                                    src={copyStatusImage3}
                                                    className='figure-img img-fluid rounded shadow-3 mb-3'
                                                    alt='...'
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </figure>
                                        </button>

                                    </div>
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
                                    <MDBModalDialog scrollable>
                                        <MDBModalContent md='8'>
                                            <MDBModalHeader>
                                                <MDBModalTitle>RSA Keys</MDBModalTitle>

                                            </MDBModalHeader>
                                            <MDBModalBody >
                                                <p style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '10px' }}>
                                                    {RSApublic}
                                                    <div style={{ position: 'relative' }}>
                                                        <button
                                                            className="btn btn-secondary btn-sm"
                                                            style={{
                                                                position: 'absolute',
                                                                bottom: '5px',
                                                                right: '5px',
                                                                marginTop: '10px'
                                                            }}
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(RSApublic);
                                                                setcopyStatusImage5("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpyPyEOzpIz1YAp9NEt84w7-gGaEkuwQ0jgMa7_OBpvlE_pMoC6kiQiHthu-yu1ffHs7o&usqp=CAU");
                                                            }}
                                                        >
                                                            <figure
                                                                className='figure'
                                                                style={{
                                                                    width: '30px',
                                                                    height: '30px',
                                                                    margin: '0'
                                                                }}
                                                            >
                                                                <img
                                                                    src={copyStatusImage5}
                                                                    className='figure-img img-fluid rounded shadow-3 mb-3'
                                                                    alt='...'
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'contain'
                                                                    }}
                                                                />
                                                            </figure>
                                                        </button>

                                                    </div>

                                                </p>
                                                <p style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '10px' }}>
                                                    {RSAprivet}
                                                    <div style={{ position: 'relative' }}>
                                                        <button
                                                            className="btn btn-secondary btn-sm"
                                                            style={{
                                                                position: 'absolute',
                                                                bottom: '5px',
                                                                right: '5px',
                                                                marginTop: '10px'
                                                            }}
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(RSAprivet);
                                                                setcopyStatusImage4("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpyPyEOzpIz1YAp9NEt84w7-gGaEkuwQ0jgMa7_OBpvlE_pMoC6kiQiHthu-yu1ffHs7o&usqp=CAU");
                                                            }}
                                                        >
                                                            <figure
                                                                className='figure'
                                                                style={{
                                                                    width: '30px',
                                                                    height: '30px',
                                                                    margin: '0'
                                                                }}
                                                            >
                                                                <img
                                                                    src={copyStatusImage4}
                                                                    className='figure-img img-fluid rounded shadow-3 mb-3'
                                                                    alt='...'
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'contain'
                                                                    }}
                                                                />
                                                            </figure>
                                                        </button>

                                                    </div>
                                                </p>

                                                <MDBCheckbox
                                                    className='custom-checkbox'
                                                    id='checkNoLabel'
                                                    label='Save this Key'
                                                    checked={checked}
                                                    onChange={() => setChecked(!checked)}
                                                />
                                            </MDBModalBody>
                                            <MDBModalFooter>
                                                {/* <MDBBtn color='secondary' onClick={toggleModal}>Close</MDBBtn> */}
                                                <MDBBtn disabled={!checked} onClick={RsaNext}>Save AccoountID</MDBBtn>
                                            </MDBModalFooter>
                                        </MDBModalContent>
                                    </MDBModalDialog>

                                </div>
                            )}


                            {alertMessage == "Account created and saved successfully." ? <p style={{ color: "green" }}>{alertMessage}</p> :
                                <p style={{ color: "red" }}>{alertMessage}</p>}

                        </MDBModalBody>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>




            <MDBModal staticBackdrop open={scrollableModal} onClose={() => setScrollableModal(false)} tabIndex='-1'>
                <MDBModalDialog scrollable centered >
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Add Record</MDBModalTitle>
                            <MDBBtn
                                className='btn-close'
                                color='none'
                                onClick={() => setScrollableModal(false)}
                            ></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <div style={{ marginBottom: '20px' }}>
                                <MDBFile label='Select you record' id='customFile' onChange={handleFileChange} />
                            </div>
                            {/* <MDBInput style={{ marginBottom: '20px' }} label="Account ID" value={depositedAccount} onChange={(e) => setdepositedAccount(e.target.value)} id="form1" type="text" />

                            <MDBTextArea style={{ marginBottom: '20px' }} label="RSA Public Key" value={RSApublicKey} onChange={(e) => setRSApublicKey(e.target.value)} id="textAreaExample" /> 
                            */}
                            <div>
                                <QrCodeScanner isOpen={scrollableModal} onClose={() => setScrollableModal(false)}  />
                            </div>


                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color='secondary' onClick={() => setScrollableModal(!setScrollableModal)}>
                                Cancel
                            </MDBBtn>
                            <MDBBtn onClick={IPFSUplod2}>Add Record</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>



        </div>


    </>)

}


