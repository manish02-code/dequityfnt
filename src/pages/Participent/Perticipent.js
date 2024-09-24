import React, { useState, useEffect } from 'react';
import "./Perticipent.css";
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { injectExtension } from '@polkadot/extension-inject';
import { useParams, useNavigate } from "react-router-dom"
import { formatBalance } from '@polkadot/util';

import {
  MDBCol,
  MDBInput,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBModalTitle,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter, MDBFile,
  MDBCheckbox
} from 'mdb-react-ui-kit';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { useRadioGroup } from '@mui/material';
// import pinataSDK from '@pinata/sdk';
import forge from 'node-forge';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { Keyring } from '@polkadot/keyring';
import { decrypt } from "n-krypta";

import QRCode from 'qrcode'

export default function Participant() {
  const [api, setapi] = useState()
  const [accounts, setAccounts] = useState([]);

  const acc = localStorage.getItem('Selected Account')
  const [selectedAccount, setSelectedAccount] = useState(acc);


  ////Profile info State
  const [profileFetch, setprofileFetch] = useState(true)
  const [accountBalance, setaccountBalance] = useState('')
  const [accountAdddress, setaccountAdddress] = useState(acc)
  const [copyStatusImage, setcopyStatusImage] = useState("https://static.vecteezy.com/system/resources/previews/015/805/731/original/copy-paste-symbol-sign-document-file-copy-duplicate-paste-archive-icon-free-vector.jpg")
  const [name, setname] = useState()
  const [age, setage] = useState()
  const [Gender, setgender] = useState()
  const [Ethenicity, setEthenicity] = useState()
  const [DataRecord, setDataRecord] = useState([])
  const [scrollableModal, setScrollableModal] = useState(false);
  const [scrollableModal2, setScrollableModal2] = useState(false);
  const [file, setFile] = useState(null);
  const [RSApublicKey, setRSApublicKey] = useState(' ')
  const [encryptedFile, setencryptedFile] = useState(null)

  const [addRecordStatus, setaddRecordStatus] = useState(' ')
  const [uploadLoading, setuploadLoading] = useState(false)
  const [GifULR, setGifURL] = useState("https://www.clipartbest.com/cliparts/dTr/6aA/dTr6aAxnc.gif")
  const [ipfsHash, setipfsHash] = useState(' ')
  const [searchQuery, setSearchQuery] = useState('');
  const [OfferRecord, setOfferRecord] = useState([])
  const [OfferId, setOfferId] = useState();
  const [RSprivet, setRSprivet] = useState('');
  const [OfferDetails, setOfferDetails] = useState([]);
  const [searchQuery2, setSearchQuery2] = useState('');
 
  const DepoId= localStorage.getItem('Selected Account DepositeID')
  const [DepositeID,setDepositeID]=useState(DepoId)


  const [passwordModal, setpasswordModal] = useState(false);
  const [password, setpassword] = useState('')
  const [RSAPrivetKey, setRSAPrivetKey] = useState(' ')
  const togglePasswordModal = () => setpasswordModal(!passwordModal);

  const [fundRequestStatus, setfundRequestStatus] = useState('Request funds')


  const [checked, setChecked] = useState(false);


  const [QRCodeModal, setQRCodeModal] = useState(false);
  const [QrcodeURL, setQrcodeURL] = useState('');
  const toggleQRCodeModal = () => setQRCodeModal(!QRCodeModal);




  const filteredData = DataRecord.filter(item => {
    return item.cid.includes(searchQuery) || item.key.includes(searchQuery);
  });

  const addrecordmodal = () => setuploadLoading(!uploadLoading);

  const navigate = useNavigate();






  const toggleOpen = () => {
    setFile(null)
    setScrollableModal(!scrollableModal)
  };


  const messagemodalOKbtn = () => {
    setpassword('')
    addrecordmodal()
    setFile(null)
    setRSApublicKey(' ')
    setencryptedFile(null)
    setGifURL("https://www.clipartbest.com/cliparts/dTr/6aA/dTr6aAxnc.gif")
    setuploadLoading(false)
    setpasswordModal(false)
    setChecked(false)
    window.location.reload();
    navigate("/Perticipent")

  }

  ////////////////////////////////////////////////////////////////
  ///Adding Record Fucntionality/////
  const addRecord = async () => {
    toggleOpen()

  }



  ///This is use to take Raw file form User
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };




  // Decrypt mnemonic
  const decryptMnemonic = async (encryptedData, password) => {
    try {

      const decryptedData = await decrypt(encryptedData, password);
      return decryptedData;
    } catch (error) {
      console.error("Error decrypting mnemonic:", error);
      throw new Error("Failed to decrypt mnemonic");
    }
  };







  const genrateQrCode = async () => {
    try {
      const response = await QRCode.toDataURL(DepoId);
      setQrcodeURL(response);
    } catch (error) {
      console.log(error);

    }
  }


  //This Function use Take RSA key of User
  const handlePasswordSubmit = async (e) => {
    // setencryptedFile(e.target.value);
    const keyring = new Keyring({ type: 'sr25519' });
    const selaccnt = localStorage.getItem('Selected Account');
    console.log(selaccnt)

    const encryptedMnemonic = localStorage.getItem(`encryptedMnemonic_${selaccnt}`)
    const tt = await decryptMnemonic(encryptedMnemonic, password)


    setRSApublicKey(tt.rsaPublicKey)
    setRSAPrivetKey(tt.rsaPrivateKey)


    togglePasswordModal()

    setChecked(true)
  };


  const clickCheckBox = async () => {
    togglePasswordModal()

  }


  const OfferID = (e) => {
    // setencryptedFile(e.target.value);
    setOfferId(e.target.value)
  };


  const RSprivetkey = (e) => {
    // setencryptedFile(e.target.value);
    setRSprivet(e.target.value)
  };



  function formatRSAPrivateKey(key) {
    // Remove any existing PEM headers or footers for private keys
    const cleanedKey = key
        .replace(/-----BEGIN PRIVATE KEY-----/, '')
        .replace(/-----END PRIVATE KEY-----/, '')
        .replace(/\s+/g, '');


    console.log('Cleaned Key:', cleanedKey);

    // Ensure the key is in a valid base64 format
    if (!/^([A-Za-z0-9+/=]+)$/.test(cleanedKey)) {
        throw new Error("Invalid RSA Private Key format");
    }

    

    // Add the PEM header and footer without trailing whitespace
    const pemFormattedKey = `-----BEGIN PRIVATE KEY----- ${cleanedKey} -----END PRIVATE KEY-----`;

    console.log( pemFormattedKey);

    return pemFormattedKey; // Remove any trailing whitespace
}




  const AppylyForOffer = async () => {
    addrecordmodal()
    setaddRecordStatus("Applying for Offer")
    const wsProvider = new WsProvider(process.env.REACT_APP_RELAY);
    const api = await ApiPromise.create({ provider: wsProvider });

    // const selaccnt = localStorage.getItem('Selected Account');

    const keyring = new Keyring({ type: 'sr25519' });
    const encryptedMnemonic = localStorage.getItem(`encryptedMnemonic_${selectedAccount}`)

    const tt = await decryptMnemonic(encryptedMnemonic, password)

  

    const accMnemonic = keyring.addFromUri(tt.mnemonic);
    if (!selectedAccount) {
      console.error("No account selected. Please select an account.");
      return;
    }
    if (!OfferId) {
      console.error("Missing OfferID")

      setaddRecordStatus("Missing OfferID")
      setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")
      return;

    }

    try {
      const test= formatRSAPrivateKey(tt.rsaPrivateKey)
      console.log(tt)
      console.log(test.trim())
      console.log(test)
      console.log(tt.rsaPrivateKey.trim())
      console.log(RSprivet)
        

      const data = await api.tx.hrmp.applyOffer(OfferId,test.trim()).signAndSend(accMnemonic);;
      const result = data.toPrimitive()
      console.log(data)
      console.log(result)
      setaddRecordStatus("Applied Sucessfully")
      setGifURL("https://cdn.dribbble.com/users/147386/screenshots/5315437/success-tick-dribbble.gif")
    } catch (error) {
      console.error("Error while Apply offer:", error);
    } finally {
      api.disconnect(); // Disconnect from the Polkadot node after fetching data
    }

  }

  //This Use to Genrate RSA Key If Use want 
  const genRateRSAKey = () => {

    // Generate an RSA key pair
    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });

    // Get the private key in PEM format
    const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
    console.log('Private Key:', privateKeyPem);

    // Get the public key in PEM format
    const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
    console.log('Public Key:', publicKeyPem);
  }


  //This use to Function genrate ASE Key
  const genRateASEKey = () => {
    setaddRecordStatus(" Genrating  Key..")

    // Generate a random 256-bit (32-byte) AES key
    const key = CryptoJS.lib.WordArray.random(32);
    //  console.log('AES Key Length:', key.words.length);
    return key.toString();

  }




  const FecthingOfferDeatils = async (OfferRecord) => {
    const wsProvider = new WsProvider(process.env.REACT_APP_RELAY); // Replace with your endpoint
    let api;

    if (!selectedAccount) {
      console.error("No account selected. Please select an account.");
      return;
    }

    try {
      api = await ApiPromise.create({ provider: wsProvider });
      const details = [];

      for (let i = 0; i < OfferRecord.length; i++) {

        const data = await api.query.hrmp.offerStorage(OfferRecord[i]);
        const result = data.toPrimitive();


        const offerObject = {
          name: result.name,
          price: result.price,
          condition: result.condition,
          id: result.id,
        };

        details.push(offerObject);

      }

      setOfferDetails(details);



    } catch (error) {
      console.error("Error fetching offer details:", error);
    } finally {
      if (api) {
        await api.disconnect(); // Disconnect from the Polkadot node after fetching data
      }
    }
  };









  const IPFSUplod = async (ecryKey) => {
    setaddRecordStatus("Uploading Your Data");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const metadata = JSON.stringify({
        name: file.name,
        type: file.type


      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);


      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5Njc2NDBjZS1hZjEzLTQ3NTktYjA3ZS04OWU5MDdmYzI2MDAiLCJlbWFpbCI6InNwYXlib3kxNDlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjY1MzMzYWEyNDU3ZjE3NjU5ZWNkIiwic2NvcGVkS2V5U2VjcmV0IjoiZjYzYWUyMjZlMzNhNTVhNmYwYzNiZmViYjJiM2JmOWFiZmQzODBlN2MzZmNjOGMyYWRjZDkwNWYwZTYxMTc3NiIsImlhdCI6MTcxNTcxMzQ2NH0._d493g9SffhA_65zaCaVDLmwFKblzqnrqzWIRT6BnkU`,
          },
          body: formData,
        }
      );


      const resData = await res.json();

      if (resData.error == "Invalid request format.") {

        console.log("Invalid request format.")
        setaddRecordStatus("Invalid request format.")
        setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")


        console.error("Invalid request format")
        return;
      } else if (!ecryKey && !ipfsHash) {
        console.error("Missing encryption key or IPFS hash.")
        console.log(("Missing encryption key or IPFS hash."))

        setaddRecordStatus("Missing encryption key or IPFS hash.")
        setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")
        return;


      } else {

        setipfsHash(resData.IpfsHash);
        await addRecordonChain(ecryKey, resData.IpfsHash);

        return resData;
      }
    } catch (error) {

      console.error("Error uploading file to IPFS:", error);
      throw error; // Rethrow the error for further handling
    }
  };








  // //This use to ENcrypte file
  const EncrypteFileASE = async () => {
    addrecordmodal()

    try {
      setaddRecordStatus(" Encyprting Your Data. Plese Wait..")
      // File content to encrypt

      const fileArrayBuffer = await file.arrayBuffer();
      const fileBytes = new Uint8Array(fileArrayBuffer);


      const ASEkey = genRateASEKey();

      // AES encryption key (must be 16, 24, or 32 bytes long)
      const key = CryptoJS.enc.Utf8.parse(ASEkey);

      // Encrypt the file content using AES
      const encrypted = CryptoJS.AES.encrypt(CryptoJS.lib.WordArray.create(fileBytes), key, {
        mode: CryptoJS.mode.ECB, // Using ECB mode for simplicity (not recommended for large files)
        padding: CryptoJS.pad.Pkcs7,
      });

      const ecryKey = encryptAesKey(RSApublicKey, ASEkey)
      console.log(typeof (encrypted.toString()))


      const blob = new Blob([encrypted.toString()], { name: file.name, type: "string" });


      setencryptedFile(blob)

      IPFSUplod(ecryKey)




    } catch (error) {

      setaddRecordStatus("Invalid Transaction, Check Balance.")
      setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")
      throw Error(error)

    }
  }


  // const fetchAndDecryptFile = async () => {
  //   try {
  //     console.log("working.......")
  //     // Fetch file from IPFS
  //     const response = await axios.get("https://ipfs.io/ipfs/QmYm6aevDfPb6NmEN5mCzTLX2b2r77gKrYuhG91UQhdDzm", {
  //       responseType: 'blob',
  //     });
  //     console.log("working.......2")

  //     // Read the file content
  //     const reader = new FileReader();
  //     reader.readAsArrayBuffer(response.data);
  //     reader.onloadend = () => {
  //       const fileData = new Uint8Array(reader.result);

  //       // Decrypt the file content using AES
  //       const decryptedBytes = CryptoJS.AES.decrypt(CryptoJS.lib.WordArray.create(fileData), ASEKey);
  //       const decryptedBlob = new Blob([decryptedBytes], { type: "image/jpeg" });

  //       // Create a URL for the decrypted image blob
  //       const decryptedURL = URL.createObjectURL(decryptedBlob);

  //       // Update state with the decrypted file
  //       setDecryptedFile(decryptedURL);
  //       saveFile();
  //       console.log("working.......Done")
  //     };
  //   } catch (error) {
  //     console.error('Error fetching or decrypting file:', error);
  //   }
  // };



  const encryptAesKey = (receivedpublicKeyPem, aesKey) => {
    setaddRecordStatus("Encrypting Your Key.")

    try {
      const publicKey = forge.pki.publicKeyFromPem(receivedpublicKeyPem);
      const encryptedAesKey = publicKey.encrypt(aesKey, 'RSA-OAEP');

      //to Decrypt
      // const decryptedAesKey = rsaKeyPair.privateKey.decrypt(forge.util.decode64(encryptedAesKey) 'RSA-OAEP');

      return forge.util.encode64(encryptedAesKey);
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  };








  const IPFSUplod2 = async (e) => {
    e.preventDefault();

    setuploadLoading(true)

    try {

      if (file) {
        const formData = new FormData();
        formData.append('RSAKey', RSApublicKey);
        formData.append('ReportFile', file);

        const response = await axios.post(`http://${process.env.REACT_APP_BACKEND_SERVER}/IpfsKEys/UploadIPFS`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setaddRecordStatus(response.data.message);

        await addRecordonChain(response.data.encryptionKey, response.data.result.IpfsHash);

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





  const addRecordonChain = async (ecryKey, cid) => {
    setaddRecordStatus("Adding Record to the Chain.")
    const wsProvider = new WsProvider(process.env.REACT_APP_RELAY);
    const api = await ApiPromise.create({ provider: wsProvider });

    // const selaccnt = localStorage.getItem('Selected Account');

    const keyring = new Keyring({ type: 'sr25519' });
    const encryptedMnemonic = localStorage.getItem(`encryptedMnemonic_${selectedAccount}`)

    console.log("5555555555",encryptedMnemonic)
    const tt = await decryptMnemonic(encryptedMnemonic, password)

  

    const accMnemonic = keyring.addFromUri(tt.mnemonic);
    if (!selectedAccount) {
      console.error("No account selected. Please select an account.");
      return;
    }
    if (!ecryKey && !cid) {
      console.error("Missing encryption key or IPFS hash.")

      setaddRecordStatus("Missing encryption key or IPFS hash.")
      setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif")
      return;

    }

    try {
      const data = await api.tx.hrmp.depositeDataPWallet(ecryKey, cid).signAndSend(accMnemonic);;
      const result = data.toPrimitive()
      setaddRecordStatus("Rocord Added Sucessfully")

      setGifURL("https://cdn.dribbble.com/users/147386/screenshots/5315437/success-tick-dribbble.gif")
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      api.disconnect(); // Disconnect from the Polkadot node after fetching data


    }

  }
  
  const DecrytpandDownload = async (cid1, encKey) => {
    try {
      setpasswordModal(true);
      console.log(cid1, encKey);

      const response = await axios.post(`http://${process.env.REACT_APP_BACKEND_SERVER}/IpfsKEys/Decryptfils`, {
        cid: cid1,
        key: encKey,
        RSaPVtKey: RSAPrivetKey
      });

      console.log(response);

      const { file, filename, mimeType } = response.data;
      console.log(response.data)

      // Convert base64 string to binary data
      const binaryString = atob(file);
      const binaryLength = binaryString.length;
      const bytes = new Uint8Array(binaryLength);
      for (let i = 0; i < binaryLength; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: mimeType });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);

    } catch (error) {
      console.error(error);
    }
  };

  const requestFunds = async (address) => {

    try {
      console.log(accountAdddress)
      await axios.post(`http://${process.env.REACT_APP_BACKEND_SERVER}/para/AccountFundRequest`, {
        body: {
          address: accountAdddress
        }
      }).then(res => {
        window.alert(res.data)
        setfundRequestStatus("Fund send Sucessfull")
      })

    } catch (error) {
      console.log(error)

    }
  }


  /////////////////////////////////////////////////////////////////////////


  // const saveFile = () => {
  //   const blob = new Blob([decryptedFile], { type: 'application/octet-stream' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'decrypted_file'; // Set the file name here
  //   document.body.appendChild(a);
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  //   document.body.removeChild(a);
  // };




  useEffect(() => {
    const FecthProfile = async () => {
      const wsProvider = new WsProvider(process.env.REACT_APP_RELAY); // Replace with your endpoint
      const api = await ApiPromise.create({ provider: wsProvider });

      if (!selectedAccount) {
        console.error("No account selected. Please select an account.");
        return;
      }

      try {
        const data = await api.query.hrmp.participantProfile(accountAdddress);
        const result = data.toPrimitive()
        genrateQrCode()
        setname(result.name)
        setage(result.age)
        setgender(result.gender)
        setEthenicity(result.ethnicity)
        setDataRecord(result.data)
        console.log(result.data)
        setOfferRecord(result.appliedofferId)

        const { data: balance } = await api.query.system.account(accountAdddress);
        // The balance is divided into free, reserved, and miscFrozen fields
        
        const formattedBalance = formatBalance(balance.free, { decimals: 12, withUnit: 'DQT' }); // or 'KSM' for Kusama
        setaccountBalance(formattedBalance)

    


        const d = await FecthingOfferDeatils(result.appliedofferId)

      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        api.disconnect(); // Disconnect from the Polkadot node after fetching data
      }
    };

    FecthProfile();
  }, []); // Empty dependency array to run only once

  return (

    <div>

      {profileFetch ? (
        <section style={{ backgroundColor: '#eee' }}>
          <MDBContainer className="py-4">
            <MDBRow>
              <MDBCol lg="4">
                <MDBCard className="mb-4">
                  <MDBCardBody className="text-center">
                    <MDBCardImage
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQss-yN_CC_KafMuYKdHqCkw1RzR1QqN0erBGYmD5EJ34kk0l5teg_itiQdXcmxU59fOZQ&usqp=CAU"
                      alt="avatar"
                      className="rounded-circle"
                      style={{ width: '150px' }}
                      fluid />
                    <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '10px' }}>
                      <p className="text-muted mb-1">Balance: {accountBalance} </p>
                      <p className="text-muted mb-1"></p>
                    </div>
                    <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '10px', position: 'relative' }}>
                      <p className="text-muted mb-1">Address: </p>
                      <p className="text-muted mb-1">
                        {accountAdddress}
                      </p>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ position: 'absolute', bottom: '5px', right: '5px', marginTop: '10px' }}
                        onClick={() => {
                          navigator.clipboard.writeText(accountAdddress);
                          setcopyStatusImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpyPyEOzpIz1YAp9NEt84w7-gGaEkuwQ0jgMa7_OBpvlE_pMoC6kiQiHthu-yu1ffHs7o&usqp=CAU")
                        }}
                      >
                        <figure className='figure' style={{ width: '30px', height: '30px', margin: '0' }}>
                          <img
                            src={copyStatusImage}
                            className='figure-img img-fluid rounded shadow-3 mb-3'
                            alt='...'
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </figure>
                      </button>
                    </div>


                    <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <MDBBtn size="lg" rounded className='bg-warning' >
                          Send
                        </MDBBtn>
                      </div>
                      <div>
                        <MDBBtn size="lg" rounded className='bg-success' >
                          Receive
                        </MDBBtn>
                      </div>



                    </div>
                    <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <MDBBtn size="sm" rounded className='bg-success' onClick={requestFunds} >
                          {fundRequestStatus}
                        </MDBBtn>
                      </div>
                      <div>
                        <MDBBtn size="sm" rounded className='bg-success' onClick={toggleQRCodeModal} >
                          Show QRcode
                        </MDBBtn>
                      </div>

                    </div>




                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol lg="8">
                <MDBCard className="mb-4">
                  <MDBCardBody>
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>Full Name</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">{name}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>Age</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">{age}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>Gender</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">{Gender}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText>Ethenicity</MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">{Ethenicity}</MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                  </MDBCardBody>
                </MDBCard>



                <MDBCard className="mb-4">
                  <MDBCardBody>
                    <MDBRow>
                      <MDBCol>
                        <MDBBreadcrumb className="rounded-3 p-3 mb-4" style={{ backgroundColor: '#eee' }}>
                          <div className="d-flex justify-content-between w-100">
                            <MDBModalTitle>Data Record</MDBModalTitle>
                            <div className="d-flex align-items-center">
                              <MDBBtn size="sm" rounded className="bg-success d-flex align-items-center " onClick={addRecord}>
                                <span className="text-lowercase text-yellow me-2" style={{ fontSize: '1.2rem' }}>Add Data</span>
                                <figure className='figure d-flex justify-content-center' style={{ width: '30px', height: '30px', margin: '0' }}>
                                  <img
                                    src="https://w7.pngwing.com/pngs/415/49/png-transparent-grass-area-symbol-brand-sign-add-logo-grass-desktop-wallpaper.png"
                                    className='figure-img img-fluid rounded-circle '
                                    alt='...'
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                  />
                                </figure>

                              </MDBBtn>
                            </div>
                          </div>
                        </MDBBreadcrumb>


                        {DataRecord.length === 0 ? (
                          <figure className='figure'>
                            <img
                              src='https://cdn.vectorstock.com/i/preview-1x/04/16/no-data-empty-concept-vector-41830416.jpg'
                              className='figure-img img-fluid rounded shadow-3 mb-3'
                              alt='...'
                              style={{ width: '700px', height: '300px' }} // Adjust the width and height as needed
                            />
                          </figure>


                        ) : (
                          <>
                            <input
                              type='text'
                              placeholder='Search CID or Key...'
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              style={{
                                marginBottom: '20px',
                                padding: '5px',
                                width: 'calc(100% - 20px)', // Adjust the width as needed
                                borderRadius: '10px',
                                border: '1px solid #ccc',
                                backgroundColor: "#C8E6C9"
                              }}></input>
                            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '10px' }}>
                              <MDBTable align='middle' style={{ backgroundColor: '#eee' }}>
                                <MDBTableHead light>
                                  <tr>
                                    <th scope='col'>#</th>
                                    <th scope='col'>CID</th>
                                    <th scope='col'>Key</th>
                                    <th scope='col'> </th>
                                  </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                  {filteredData.map((item, idx) => (
                                    <tr key={idx} className='hover-row'>
                                      <th scope='row'>{idx + 1}</th>
                                      <td>{item.cid.slice(0, 4)}...{item.cid.slice(-10)}</td> {/* Display first 4 characters and last 4 characters of CID */}
                                      <td>{item.key.slice(0, 4)}...{item.key.slice(-10)}</td> {/* Display first 4 characters and last 4 characters of Key */}
                                      <td>
                                        <MDBBtn color='link' size='sm' onClick={() => DecrytpandDownload(item.cid, item.key)}>
                                          <figure className='figure' style={{ width: '30px', height: '30px', margin: '0' }}>
                                            <img
                                              src="https://png.pngtree.com/png-vector/20190621/ourmid/pngtree-download-icon-graphic-design-template-vector-illustration-png-image_1499700.jpg"
                                              className='figure-img img-fluid rounded shadow-3 mb-3'
                                              alt='...'
                                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                            />
                                          </figure>
                                        </MDBBtn>
                                      </td>
                                    </tr>
                                  ))}
                                </MDBTableBody>
                              </MDBTable>
                            </div>
                          </>




                        )}

                      </MDBCol>
                    </MDBRow>
                  </MDBCardBody>
                </MDBCard>


                <MDBCard className="mb-4">
                  <MDBCardBody>
                    <MDBRow>
                      <MDBCol>
                        <MDBBreadcrumb className="rounded-3 p-3 mb-4" style={{ backgroundColor: '#eee' }}>
                          <div className="d-flex justify-content-between w-100">
                            <MDBModalTitle>Applied offer </MDBModalTitle>
                            <div className="d-flex align-items-center">
                              <MDBBtn size="sm" rounded className="bg-success d-flex align-items-center " onClick={() => setScrollableModal2(true)}>
                                <span className="text-lowercase text-yellow me-2" style={{ fontSize: '1.2rem' }}>Apply</span>
                                <figure className='figure d-flex justify-content-center' style={{ width: '30px', height: '30px', margin: '0' }}>
                                  <img
                                    src="https://w7.pngwing.com/pngs/415/49/png-transparent-grass-area-symbol-brand-sign-add-logo-grass-desktop-wallpaper.png"
                                    className='figure-img img-fluid rounded-circle '
                                    alt='...'
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                  />
                                </figure>

                              </MDBBtn>
                            </div>
                          </div>
                        </MDBBreadcrumb>


                        {OfferRecord.length === 0 ? (
                          <figure className='figure'>
                            <img
                              src='https://cdn.vectorstock.com/i/preview-1x/04/16/no-data-empty-concept-vector-41830416.jpg'
                              className='figure-img img-fluid rounded shadow-3 mb-3'
                              alt='...'
                              style={{ width: '700px', height: '300px' }} // Adjust the width and height as needed
                            />
                          </figure>


                        ) : (
                          <>
                            <input
                              type='text'
                              placeholder='Search Offer'
                              value={searchQuery2}
                              onChange={(e) => setSearchQuery2(e.target.value)}
                              style={{
                                marginBottom: '20px',
                                padding: '5px',
                                width: 'calc(100% - 20px)', // Adjust the width as needed
                                borderRadius: '10px',
                                border: '1px solid #ccc',
                                backgroundColor: "#C8E6C9"
                              }}></input>
                            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '10px' }}>
                              <MDBTable align='middle' style={{ backgroundColor: '#eee' }}>
                                <MDBTableHead light>
                                  <tr>
                                    <th scope='col'>Offer ID</th>
                                    <th scope='col'>Name</th>
                                    <th scope='col'>Price</th>
                                    <th scope='col'>Condition</th>
                                    <th scope='col'> </th>
                                  </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                  {OfferDetails.map((item, idx) => (
                                    <tr key={idx} className='hover-row'>
                                      <th scope='row'>{item.id}</th>
                                      <td>{item.name}</td> {/* Display first 4 characters and last 4 characters of CID */}
                                      <td>{item.price}</td> {/* Display first 4 characters and last 4 characters of Key */}
                                      <td>{item.condition}</td> {/* Display first 4 characters and last 4 characters of Key */}
                                      <td>
                                        <MDBBtn color='link' size='sm'>
                                          <figure className='figure' style={{ width: '30px', height: '30px', margin: '0' }}>
                                            <img
                                              src="https://png.pngtree.com/png-vector/20190621/ourmid/pngtree-download-icon-graphic-design-template-vector-illustration-png-image_1499700.jpg"
                                              className='figure-img img-fluid rounded shadow-3 mb-3'
                                              alt='...'
                                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                            />
                                          </figure>
                                        </MDBBtn>
                                      </td>
                                    </tr>
                                  ))}
                                </MDBTableBody>
                              </MDBTable>
                            </div>
                          </>


                        )}

                      </MDBCol>
                    </MDBRow>
                  </MDBCardBody>
                </MDBCard>

              </MDBCol>

            </MDBRow>
          </MDBContainer>




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
                  <div style={{ backgroundColor: '#eee', borderRadius: '10px', padding: '10px', marginTop: '10px', position: 'relative', marginBottom: '20px' }}>
                    <MDBCheckbox
                      className='custom-checkbox'
                      id='checkNoLabel'
                      label='Use My RSA Key'
                      checked={checked}
                      onChange={clickCheckBox}
                    />
                    {/* <MDBInput label="Enter RSA Public " id="form1" type="text" value={RSApublicKey} onChange={userRSAPublicKey} /> */}
                  </div>

                  {/* Logic here*/}

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





          <MDBModal staticBackdrop open={scrollableModal2} onClose={() => setScrollableModal2(false)} tabIndex='-1'>
            <MDBModalDialog scrollable centered >
              <MDBModalContent>
                <MDBModalHeader>
                  <MDBModalTitle>Apply Offer</MDBModalTitle>
                  <MDBBtn
                    className='btn-close'
                    color='none'
                    onClick={() => setScrollableModal2(false)}
                  ></MDBBtn>
                </MDBModalHeader>
                <MDBModalBody>

                  <div style={{ marginBottom: '20px' }}>
                    <MDBInput label="Enter Offer ID " id="form1" type="Number" value={OfferId} onChange={OfferID} />
                  </div>
                  {/* <div style={{ marginBottom: '20px' }}>
                    <MDBInput label="Enter Rsa key " type="text"  value={RSprivet} onChange={RSprivetkey} />
                  </div> */}

                  {/* Logic here*/}

                  <MDBCheckbox
                      className='custom-checkbox'
                      id='checkNoLabel'
                      label='Use My RSA Key'
                      checked={checked}
                      onChange={clickCheckBox}
                    />
                    {/* <MDBInput label="Enter RSA Public " id="form1" type="text" value={RSApublicKey} onChange={userRSAPublicKey} /> */}
                 

                </MDBModalBody>

                <MDBModalFooter>
                  <MDBBtn color='danger' onClick={() => setScrollableModal2(!setScrollableModal2)}>
                    Cancel
                  </MDBBtn>

                  {checked==true?(<MDBBtn color='success' onClick={AppylyForOffer}>Apply</MDBBtn>)
                  :(<MDBBtn disabled={true} color='success' onClick={AppylyForOffer}>Apply</MDBBtn>)}
                
                </MDBModalFooter>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>



          {uploadLoading ? (
            <>

              <MDBModal staticBackdrop open={uploadLoading} onClick={messagemodalOKbtn} tabIndex='-1'>
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
                      <MDBBtn color='secondary' onClick={messagemodalOKbtn}>
                        OK
                      </MDBBtn>
                    </MDBModalFooter>
                  </MDBModalContent>
                </MDBModalDialog>
              </MDBModal>
            </>
          ) : null}



          <>
            <MDBModal staticBackdrop tabIndex='-1' open={passwordModal} onClose={() => setpasswordModal(false)}>
              <MDBModalDialog>
                <MDBModalContent>
                  <MDBModalHeader>
                    <MDBModalTitle>Enter Password</MDBModalTitle>
                    <MDBBtn className='btn-close' color='none' onClick={togglePasswordModal}></MDBBtn>
                  </MDBModalHeader>
                  <MDBModalBody>
                    <MDBInput
                      wrapperClass='mb-4'
                      label='Password'
                      size='lg'
                      type='password'
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
                    />
                  </MDBModalBody>
                  <MDBModalFooter>

                    <MDBBtn onClick={handlePasswordSubmit}>Sing Transaction</MDBBtn>
                  </MDBModalFooter>
                </MDBModalContent>
              </MDBModalDialog>
            </MDBModal>
          </>



          <>
           

            <MDBModal tabIndex='-1' open={QRCodeModal} onClose={() => setQRCodeModal(false)}>
              <MDBModalDialog centered>
                <MDBModalContent>
                  <MDBModalHeader>
                    <MDBModalTitle>Scan To Desposite</MDBModalTitle>
                    <MDBBtn className='btn-close' color='none' onClick={toggleQRCodeModal}></MDBBtn>
                  </MDBModalHeader>
                  <MDBModalBody>
                    {DepositeID?
                    <MDBCardImage
                    src={QrcodeURL}
                
                    style={{ width: '500px' }}
                    fluid />:
                    <MDBCardImage
                      src='https://media.istockphoto.com/id/687868664/vector/error-404-panda-surprise-page-not-found-template-for-web-site-china-bear-does-not-know-and-is.jpg?s=170667a&w=0&k=20&c=kwFCeXzvNzGUcVcu4in3ymF-DPd4rRH7Vy6RM4Q50MQ='
                 
                      style={{ width: '500px' }}
                      fluid />
                    }
                    
                  </MDBModalBody>
                  <MDBModalFooter>
                    <MDBBtn color='secondary' onClick={toggleQRCodeModal}>
                      Close
                    </MDBBtn>
                  </MDBModalFooter>
                </MDBModalContent>
              </MDBModalDialog>
            </MDBModal>
          </>



        </section>
      ) : "No data Found"}


    </div>
  );
}
