import React, { useState, useEffect } from 'react';
import "./Perticipent.css";
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { injectExtension } from '@polkadot/extension-inject';
import { useParams, useNavigate } from "react-router-dom"

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
  MDBModalFooter, MDBFile
} from 'mdb-react-ui-kit';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { useRadioGroup } from '@mui/material';
// import pinataSDK from '@pinata/sdk';
import forge from 'node-forge';
import CryptoJS from 'crypto-js';


export default function Participant() {
  const [api, setapi] = useState()
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("Test");

  const acc = localStorage.getItem('Selected Account')





  ////Profile info State
  const [profileFetch, setprofileFetch] = useState(true)
  const [accountBalance, setaccountBalance] = useState(0)
  const [accountAdddress, setaccountAdddress] = useState(acc)
  const [copyStatusImage, setcopyStatusImage] = useState("https://static.vecteezy.com/system/resources/previews/015/805/731/original/copy-paste-symbol-sign-document-file-copy-duplicate-paste-archive-icon-free-vector.jpg")
  const [name, setname] = useState()
  const [age, setage] = useState(1)
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
  const [OfferDetails, setOfferDetails] = useState([]);
  const [searchQuery2, setSearchQuery2] = useState('');




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
    addrecordmodal()
    setFile(null)
    setRSApublicKey(' ')
    setencryptedFile(null)
    setGifURL("https://www.clipartbest.com/cliparts/dTr/6aA/dTr6aAxnc.gif")
    setuploadLoading(false)
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


  //This Function use Take RSA key of User
  const userRSAPublicKey = (e) => {
    // setencryptedFile(e.target.value);
    setRSApublicKey(e.target.value)
  };


  const OfferID = (e) => {
    // setencryptedFile(e.target.value);
    setOfferId(e.target.value)
  };



  const AppylyForOffer = async () => {
    addrecordmodal()
    setaddRecordStatus("Applying for Offer")
    const wsProvider = new WsProvider('ws://3.109.51.55:9944'); // Replace with your endpoint
    const api = await ApiPromise.create({ provider: wsProvider });
    await web3Enable("Manish")
    const selaccnt = localStorage.getItem('Selected Account');
    const injector = await web3FromAddress(selaccnt);

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
      const data = await api.tx.hrmp.applyOffer(OfferId).signAndSend(selaccnt, { signer: injector.signer });;
      const result = data.toPrimitive()
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
    const wsProvider = new WsProvider('ws://3.109.51.55:9945'); // Replace with your endpoint
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







// // This is used to encrypt the file
// const EncrypteFileASE = async (file) => {
//   addrecordmodal();
  
//   try {
//     setaddRecordStatus("Encrypting Your Data. Please Wait...");
    
//     if (!file) {
//       throw new Error("No file selected for encryption.");
//     }

//     const fileArrayBuffer = await file.arrayBuffer();
//     const fileBytes = new Uint8Array(fileArrayBuffer);
    
//     const ASEkey = genRateASEKey();
//     const key = CryptoJS.enc.Utf8.parse(ASEkey);
    
//     const encrypted = CryptoJS.AES.encrypt(CryptoJS.lib.WordArray.create(fileBytes), key, {
//       mode: CryptoJS.mode.CBC, // Using CBC mode for better security
//       padding: CryptoJS.pad.Pkcs7,
//     });
    
//     const ecryKey = encryptAesKey(RSApublicKey, ASEkey);
    
//     const blob = new Blob([encrypted.toString()], { type: 'string' }); // Set appropriate MIME type
    
//     setencryptedFile(blob);
    
//     IPFSUplod(ecryKey);
    
//   } catch (error) {
//     setaddRecordStatus("Encryption failed. Please try again.");
//     setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif");
//     console.error("Encryption error:", error);
//   }
// };

// // This function is used to upload the encrypted file to IPFS
// const IPFSUplod = async (ecryKey) => {
//   setaddRecordStatus("Uploading Your Data");
  
//   try {
//     if (!encryptedFile) {
//       throw new Error("No encrypted file available for upload.");
//     }

//     const formData = new FormData();
//     formData.append("file", encryptedFile);
    
//     const metadata = JSON.stringify({
//       name: encryptedFile.name,

//     });
//     formData.append("pinataMetadata", metadata);
    
//     const options = JSON.stringify({
//       cidVersion: 0,
//     });
//     formData.append("pinataOptions", options);
    
//     const res = await fetch(
//       "https://api.pinata.cloud/pinning/pinFileToIPFS",
//       {
//         method: "POST",
//         headers: {
//               Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5Njc2NDBjZS1hZjEzLTQ3NTktYjA3ZS04OWU5MDdmYzI2MDAiLCJlbWFpbCI6InNwYXlib3kxNDlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjY1MzMzYWEyNDU3ZjE3NjU5ZWNkIiwic2NvcGVkS2V5U2VjcmV0IjoiZjYzYWUyMjZlMzNhNTVhNmYwYzNiZmViYjJiM2JmOWFiZmQzODBlN2MzZmNjOGMyYWRjZDkwNWYwZTYxMTc3NiIsImlhdCI6MTcxNTcxMzQ2NH0._d493g9SffhA_65zaCaVDLmwFKblzqnrqzWIRT6BnkU`,

//         },
//         body: formData,
//       }
//     );
    
//     const resData = await res.json();
    
//     if (resData.error) {
//       setaddRecordStatus("Invalid request format.");
//       setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif");
//       console.error("Invalid request format:", resData.error);
//       return;
//     } else if (!ecryKey || !resData.IpfsHash) {
//       setaddRecordStatus("Missing encryption key or IPFS hash.");
//       setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif");
//       console.error("Missing encryption key or IPFS hash.");
//       return;
//     } else {
//       setipfsHash(resData.IpfsHash);
//       await addRecordonChain(ecryKey, resData.IpfsHash);
//       return resData;
//     }
//   } catch (error) {
//     setaddRecordStatus("Upload failed. Please try again.");
//     setGifURL("https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif");
//     console.error("Error uploading file to IPFS:", error);
//   }
// };



  // //This Function is use to Upload Encrypted file on IPFS
  const IPFSUplod = async (ecryKey) => {
    setaddRecordStatus("Uploading Your Data");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const metadata = JSON.stringify({
        name: file.name,
        type:file.type
      
 
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
      console.log(typeof(encrypted.toString()))


      const blob = new Blob([encrypted.toString()], { name:file.name,type: "string" });


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



  const addRecordonChain = async (ecryKey, cid) => {
    setaddRecordStatus("Adding Record to the Chain.")
    const wsProvider = new WsProvider('ws://3.109.51.55:9944'); // Replace with your endpoint
    const api = await ApiPromise.create({ provider: wsProvider });
    await web3Enable("Manish")
    const selaccnt = localStorage.getItem('Selected Account');
    const injector = await web3FromAddress(selaccnt);

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
      const data = await api.tx.hrmp.depositeDataPWallet(ecryKey, cid).signAndSend(selaccnt, { signer: injector.signer });;
      const result = data.toPrimitive()
      setaddRecordStatus("Rocord Added Sucessfully")
      setGifURL("https://cdn.dribbble.com/users/147386/screenshots/5315437/success-tick-dribbble.gif")
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      api.disconnect(); // Disconnect from the Polkadot node after fetching data
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
      const wsProvider = new WsProvider('ws://3.109.51.55:9945'); // Replace with your endpoint
      const api = await ApiPromise.create({ provider: wsProvider });

      if (!selectedAccount) {
        console.error("No account selected. Please select an account.");
        return;
      }

      try {
        const data = await api.query.hrmp.participantProfile(accountAdddress);
        const result = data.toPrimitive()
        console.log(result)
        setname(result.name)
        setage(result.age)
        setgender(result.gender)
        setEthenicity(result.ethnicity)
        setDataRecord(result.data)
        setOfferRecord(result.appliedofferId)
        const d=await FecthingOfferDeatils(result.appliedofferId)

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
                      <p className="text-muted mb-1">Balance: {accountBalance} DQT</p>
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
                  <div style={{ marginBottom: '20px' }}>
                    <MDBInput label="Enter RSA Public " id="form1" type="text" value={RSApublicKey} onChange={userRSAPublicKey} />
                  </div>

                  {/* Logic here*/}

                </MDBModalBody>
                <MDBModalFooter>
                  <MDBBtn color='secondary' onClick={() => setScrollableModal(!setScrollableModal)}>
                    Cancel
                  </MDBBtn>
                  <MDBBtn onClick={EncrypteFileASE}>Add Record</MDBBtn>
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

                  {/* Logic here*/}

                </MDBModalBody>
                <MDBModalFooter>
                  <MDBBtn color='danger' onClick={() => setScrollableModal2(!setScrollableModal2)}>
                    Cancel
                  </MDBBtn>
                  <MDBBtn color='success' onClick={AppylyForOffer}>Apply</MDBBtn>
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


        </section>
      ) : "No data Found"}


    </div>
  );
}
