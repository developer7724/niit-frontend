'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    const [transform, setTransform] = useState('translateX(-100%)');
    const [userDetails, setUserDetails] = useState(null);

    const [password, setPassword] = useState('');
    const [display, setDisplay] = useState('none');

    const [confirmPassword, setConfirmPassword] = useState('');

    const [mssg, setMssg] = useState('');
    const [noti, setNoti] = useState([]);
    const [show, setShow] = useState('none');

    useEffect(() => {
      const storedData = sessionStorage.getItem("userDetails");
    
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // console.log(parsedData);
        setUserDetails(parsedData);
        setPassword(parsedData.userPassword);

        // console.log(parsedData.userName);

        getnotify(parsedData.userName);
      } else {
        router.push('/login');
      }
    }, []);

    const click = () => {
      if (transform === 'translateX(-100%)') {
        setTransform('translateX(0px)');
      } else {
        setTransform('translateX(-100%)');
      }
    }

    const reset = () => {
        setTransform('translateX(-100%)');
    }

    const logout = () => {
      sessionStorage.removeItem("userDetails");
      router.push('/');
    }

    const handlePasswordChange = async () => {
      try {
        const response = await fetch(`http://192.168.29.134:1013/update/password?username=${userDetails.userName}&password=${password}&cpass=${confirmPassword}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (response.ok) {
          // Update the session variable with the new userDetails
          const updatedUserDetails = { ...userDetails, userPassword: password };
          sessionStorage.setItem("userDetails", JSON.stringify(updatedUserDetails));
    
          // Close the popup and reset the password state
          setDisplay('none');
          setPassword('');
          setConfirmPassword(''); // Reset confirmPassword state
        } else {
          // Handle error response
          console.error('Password update failed');
        }
      } catch (error) {
        console.error('Error occurred while updating password', error);
      }
    }

    const getnotify = async (userName) => {
      try {
        // console.log(userDetails.userName);
        const response = await fetch(`http://192.168.29.134:1013/readnotification?username=${userName}`)
        const result = await response.json();

        if(response.ok) {
          // console.log(result[result.length-1]);
          setMssg(result[result.length-1]);
          setNoti(result);
        } else {
          console.log("error");
        }
      } catch (error) {
        console.error('Error occurred :', error);
      }
    }

  return (
    <main className={styles.main}>
      {/* conditionally render the page content if userDetails is not null, i.e, if the user is logged in. */}
      {
      userDetails ? (
        <>
        <div className={`${styles.popup} ${styles.display}`} style={{ display: `${show}` }}>
          <Image className={styles.cross}
            src="/cross(1).svg"
            alt=""
            width={14}
            height={14}
            onClick={() => setShow('none')}
          />
          <p className={styles.p} style={{ width: '100%', textAlign: 'center' }}>All Notifications</p>
          <hr className={styles.hr}></hr>
          {noti.map((notification, index) => (
          <div key={index} className={styles.notify} style={{ width: '100%', height: '36px' }}>
          {notification}
          </div>
          ))}
        </div>
          <div className={styles.popup} style={{ display: `${display}` }}>
            <Image className={styles.cross}
            src="/cross(1).svg"
            alt=""
            width={14}
            height={14}
            onClick={() => setDisplay('none')}
            />
            <input type="password" className={styles.password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password"></input>
            <input type="text" className={styles.password} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter Password"></input>
            <button className={styles.popup_btn} onClick={handlePasswordChange}>Change</button>
          </div>
          <div className={styles.dropdown} style={{ transform: `${transform}` }}>
              <Image className={styles.cross}
              src="/cross.svg"
              alt=""
              width={20}
              height={20}
              onClick={reset}
              />
              <ul>
              <li className={`${styles.li} ${styles.mark}`}>Dashboard</li>
              <li className={`${styles.li} ${styles.highlight}`}><Link href="/student/profile">Profile</Link></li>
              <li className={styles.li}><Link href="/student/batch">Batches</Link></li>
              <li className={styles.li}><Link href="/student/task">Tasks</Link></li>
            </ul>
          </div>
        <nav className={styles.nav}>
        <div className={styles.top}>
          <Image className={styles.logo}
          src="/logo.svg"
          alt=""
          width={44}
          height={44}
          />
          <div className={styles.name}>Student Directory</div>
        </div>
            <ul className={styles.ul}>
              <li className={`${styles.li} ${styles.mark}`}>Dashboard</li>
              <li className={`${styles.li} ${styles.highlight}`}><Link href="/student/profile">Profile</Link></li>
              <li className={styles.li}><Link href="/student/batch">Batches</Link></li>
              <li className={styles.li}><Link href="/student/task">Tasks</Link></li>
            </ul>
            <Image className={styles.menu}
            src="/burger-menu.svg"
            alt=""
            width={40}
            height={40}
            onClick={click}
            />
        </nav>
  
        <div className={styles.right}>
        <button className={styles.logout} onClick={logout}>logout</button>
        <div className={styles.card}>
          <div className={styles.back}>
            <div className={styles.pic} onClick={() => setDisplay('flex')}>
              <Image
              src="/student.svg"
              alt=""
              width={52}
              height={52}
              />
            </div>
            <div>
              <p className={styles.username}>{userDetails.userName}</p>
              <p className={styles.email}>{userDetails.userEmail}</p>
            </div>
          </div>
          <div className={styles.box_section}>
            <div className={styles.box}>
              <p className={styles.h}>College</p>
              <p className={styles.text}>{userDetails.organization_name}</p>
            </div>
            <div className={styles.box}>
              <p className={styles.h}>Year</p>
              <p className={styles.text}>{userDetails.year}</p>
            </div>
            <div className={styles.box}>
              <p className={styles.h}>Joining Date</p>
              <p className={styles.text}>{userDetails.join_date}</p>
            </div>
            <div className={styles.box}>
              <p className={styles.h}>Role</p>
              <p className={styles.text}>{userDetails.userRole}</p>
            </div>
          </div>
          <div className={styles.warnings}>
            <p className={styles.p}>Notifications</p>
            <div className={styles.notify} onClick={() => setShow('flex')}>{mssg}</div>
          </div>
        </div>
        </div>
        </>
          ) : null
      }
    </main>
  );
}