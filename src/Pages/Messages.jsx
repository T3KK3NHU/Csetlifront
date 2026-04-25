import React, { useState, useEffect, useMemo, useRef } from "react";
import Navbar from "../Components/Navbar";
import simplehaz from "../kepek/feketeHaz.svg";
import messages from "../kepek/feketeKomment.svg";
import settings from "../kepek/feketeSettings.svg";
import people from "../kepek/feketePeople.svg";
import getLanguage from "../language";
import BaratokCard from "../Components/BaratokCard";
import UzenetekCard from "../Components/UzenetekCard";
<<<<<<< HEAD
import Button from "../Components/Button";
import {
    ismerosok,
    BASE,
    uzenetkuldes,
    getUzenetek,
    szobakeszites,
    adataim,
} from "../api";
=======
import { ismerosok, BASE, uzenetkuldes, getUzenetek, szobakeszites, adataim } from "../api";
>>>>>>> 047caf79a9b5c2ca89e345688faf037c58cd6784

export default function Messages() {
    const [smerosok, setIsmerosok] = useState([]);
    const [lang, setLang] = useState(getLanguage("1"));
    const [ismerosId, setIsmerosId] = useState(null);
    const [szobaId, setSzobaId] = useState(null);
    const [text, setText] = useState("");
    const [sajatKep, setSajatKep] = useState(null);
    const [kivalasztottIsmerosKep, setKivalasztottIsmerosKep] = useState(null);
<<<<<<< HEAD
    const [uzenet, setUzenet] = useState([]);
=======
>>>>>>> 047caf79a9b5c2ca89e345688faf037c58cd6784
    const messagesEndRef = useRef(null);

    useEffect(() => {
        (async () => {
            const data = await ismerosok();
<<<<<<< HEAD

=======
            console.log("ismerosok valasz:", data);
>>>>>>> 047caf79a9b5c2ca89e345688faf037c58cd6784
            if (data.result && Array.isArray(data.ismerosok)) {
                setIsmerosok(data.ismerosok);
            } else {
                setIsmerosok([]);
            }
<<<<<<< HEAD
=======
            console.log("ismerosok ID:", ismerosId);
>>>>>>> 047caf79a9b5c2ca89e345688faf037c58cd6784
        })();

        (async () => {
            const me = await adataim();
            if (me.result) setSajatKep(me.user?.kep ?? null);
        })();

        const language = JSON.parse(localStorage.getItem("language")) || { lang: "0" };
        setLang(getLanguage(language.lang));
    }, []);
<<<<<<< HEAD
=======
    const [uzenet, setUzenet] = useState([]);
>>>>>>> 047caf79a9b5c2ca89e345688faf037c58cd6784

    const sortedUzenetek = useMemo(() => {
        const getTime = (m) => {
            const raw =
                m?.createdAt ??
                m?.created_at ??
                m?.timestamp ??
                m?.time ??
                m?.datum ??
                m?.kuldve ??
                m?.letrehozva;
<<<<<<< HEAD

            if (typeof raw === "number") return raw;

=======
            if (typeof raw === "number") return raw;
>>>>>>> 047caf79a9b5c2ca89e345688faf037c58cd6784
            if (typeof raw === "string") {
                const t = Date.parse(raw);
                if (!Number.isNaN(t)) return t;
            }
<<<<<<< HEAD

=======
>>>>>>> 047caf79a9b5c2ca89e345688faf037c58cd6784
            const id = typeof m?.id === "number" ? m.id : Number(m?.id);
            return Number.isFinite(id) ? id : 0;
        };

        return [...uzenet].sort((a, b) => getTime(a) - getTime(b));
    }, [uzenet]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [sortedUzenetek.length, szobaId]);

    useEffect(() => {
        if (!szobaId) return;

        async function loadMessages() {
            const res = await getUzenetek(szobaId);
<<<<<<< HEAD

=======
>>>>>>> 047caf79a9b5c2ca89e345688faf037c58cd6784
            if (res.result) {
                setUzenet(res.message.uzenetek);
            }
        }

        loadMessages();

        const interval = setInterval(loadMessages, 2000);

        return () => clearInterval(interval);
    }, [szobaId]);

    const sendMessage = async () => {
        if (!szobaId || !text.trim()) return;

<<<<<<< HEAD
        const currentText = text.trim();
        setText("");

        const res = await uzenetkuldes(szobaId, currentText);

        if (res.result) {
=======
        const currentText = text;
        setText("");

        const res = await uzenetkuldes(szobaId, currentText);
        if (res.result) {
            //frisit hogy jo legyen a sorend
>>>>>>> 047caf79a9b5c2ca89e345688faf037c58cd6784
            const refreshed = await getUzenetek(szobaId);
            if (refreshed.result) setUzenet(refreshed.message.uzenetek);
        }
    };

    return (
<<<<<<< HEAD
        <>
            <style>
                {`
                    .messages-page {
                        min-height: 100vh;
                        height: 100vh;
                        overflow: hidden;
                    }

                    .messages-content {
                        height: 100vh;
                        padding-top: 100px;
                    }

                    .messages-layout {
                        height: calc(100vh - 120px);
                        display: flex;
                        gap: 20px;
                    }

                    .friends-panel {
                        width: 260px;
                        min-width: 260px;
                        height: 100%;
                        overflow-y: auto;
                        scrollbar-width: none;
                    }

                    .friends-panel::-webkit-scrollbar {
                        display: none;
                    }

                    .chat-panel {
                        flex: 1;
                        height: 100%;
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                    }

                    .messages-list {
                        flex: 1;
                        overflow-y: auto;
                        scrollbar-width: none;
                        padding-bottom: 15px;
                    }

                    .messages-list::-webkit-scrollbar {
                        display: none;
                    }

                    .message-input-box {
                        display: flex;
                        gap: 8px;
                        padding: 12px;
                        position: sticky;
                        bottom: 0;
                        background: inherit;
                        z-index: 5;
                    }

                    .message-input-box input {
                        min-height: 45px;
                    }

                    .message-input-box button {
                        min-width: 90px;
                    }

                    .empty-chat {
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        opacity: 0.75;
                        text-align: center;
                        padding: 20px;
                    }

                    @media (max-width: 768px) {
                        .messages-page {
                            overflow: hidden;
                        }

                        .messages-content {
                            padding-top: 80px;
                        }

                        .messages-layout {
                            height: calc(100vh - 90px);
                            flex-direction: column;
                            gap: 10px;
                            padding: 0 10px;
                        }

                        .friends-panel {
                            width: 100%;
                            min-width: 100%;
                            height: 145px;
                            flex: 0 0 145px;
                            overflow-x: auto;
                            overflow-y: hidden;
                            padding: 12px !important;
                            margin: 0 !important;
                        }

                        .friends-title {
                            margin-top: 0 !important;
                            margin-bottom: 8px;
                        }

                        .friends-list {
                            display: flex;
                            flex-direction: row;
                            gap: 10px;
                            overflow-x: auto;
                            overflow-y: hidden;
                            padding-bottom: 6px;
                            scrollbar-width: none;
                        }

                        .friends-list::-webkit-scrollbar {
                            display: none;
                        }

                        .friends-list > * {
                            flex: 0 0 auto;
                        }

                        .chat-panel {
                            height: calc(100vh - 250px);
                            margin: 0 !important;
                        }

                        .chat-inner {
                            padding: 10px !important;
                        }

                        .messages-list {
                            padding-bottom: 8px;
                        }

                        .message-input-box {
                            padding: 8px;
                            gap: 6px;
                        }

                        .message-input-box input {
                            min-height: 42px;
                            font-size: 15px;
                        }

                        .message-input-box button {
                            min-width: 75px;
                            font-size: 14px;
                            padding-left: 10px;
                            padding-right: 10px;
                        }
                    }

                    @media (max-width: 420px) {
                        .messages-content {
                            padding-top: 75px;
                        }

                        .friends-panel {
                            height: 130px;
                            flex-basis: 130px;
                        }

                        .chat-panel {
                            height: calc(100vh - 220px);
                        }

                        .message-input-box button {
                            min-width: 68px;
                        }
                    }
                `}
            </style>

            <div className="background messages-page">
                <Navbar
                    homeI={simplehaz}
                    messagesI={messages}
                    settingsI={settings}
                    peopleI={people}
                />

                <div className="background text-white messages-content">
                    <div className="container messages-layout">
                        <div className="friends-panel d-flex flex-column align-items-start bombo px-4 p-2">
                            <div className="d-flex flex-row mt-4 friends-title">
                                <h4 className="d-flex text-white m-0">{lang.friends}</h4>
                                <div className="m-1">( {smerosok.length} )</div>
                            </div>

                            <div className="friends-list w-100">
                                {smerosok.length > 0 ? (
                                    smerosok.map((ismeros, index) => (
                                        <BaratokCard
                                            key={index}
                                            profilkep={`${BASE}/uploads/${ismeros.kep}`}
                                            felhasznalonev={ismeros.felhasznalo_nev}
                                            onClick={async () => {
                                                setIsmerosId(ismeros.felhasznalo_id);
                                                setKivalasztottIsmerosKep(ismeros.kep);

                                                const res = await szobakeszites(ismeros.felhasznalo_id);

                                                if (res.result) {
                                                    setSzobaId(res.szobaId);
                                                } else {
                                                    alert(res.message || "Szerverhiba (szoba létrehozás)");
                                                }
                                            }}
                                        />
                                    ))
                                ) : (
                                    <p>{lang.messageIsNotFriend}(</p>
                                )}
                            </div>
                        </div>

                        <div className="chat-panel bombo">
                            <div className="chat-inner flex-grow-1 d-flex flex-column h-100 p-3">
                                <div className="messages-list">
                                    {!szobaId ? (
                                        <div className="empty-chat">
                                            <h5>{lang.messageFriendToChat}</h5>
                                        </div>
                                    ) : (
                                        <>
                                            {sortedUzenetek.map((msg, i) =>
                                                msg.felhasznalo_id === ismerosId ? (
                                                    <UzenetekCard
                                                        key={msg.id ?? i}
                                                        balUzenet={msg.szoveg}
                                                        balProfilkep={
                                                            kivalasztottIsmerosKep
                                                                ? `${BASE}/uploads/${kivalasztottIsmerosKep}`
                                                                : undefined
                                                        }
                                                        jobbProfilkep={
                                                            sajatKep
                                                                ? `${BASE}/uploads/${sajatKep}`
                                                                : undefined
                                                        }
                                                    />
                                                ) : (
                                                    <UzenetekCard
                                                        key={msg.id ?? i}
                                                        jobbUzenet={msg.szoveg}
                                                        balProfilkep={
                                                            kivalasztottIsmerosKep
                                                                ? `${BASE}/uploads/${kivalasztottIsmerosKep}`
                                                                : undefined
                                                        }
                                                        jobbProfilkep={
                                                            sajatKep
                                                                ? `${BASE}/uploads/${sajatKep}`
                                                                : undefined
                                                        }
                                                    />
                                                )
                                            )}

                                            <div ref={messagesEndRef} />
                                        </>
                                    )}
                                </div>

                                <div className="message-input-box">
                                    <input
                                        className="form-control"
                                        placeholder={lang.placeholderMessage}
                                        value={text}
                                        disabled={!szobaId}
                                        onChange={(e) => setText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                sendMessage();
                                            }
                                        }}
                                    />
                                     <Button
                                        content={lang.Send}
                                        className="btn csetliColor"
                                        disabled={!szobaId || !text.trim()}
                                        onClick={sendMessage}
                                        >
                                     </Button>
                                </div>
=======
        <div className="background" style={{ height: 100, overflow: "hidden" }}>
            <Navbar homeI={simplehaz} messagesI={messages} settingsI={settings} peopleI={people} />
            <div className="row d-flex flex-column justify-content-start background text-white" style={{ paddingTop: "100px" }}>
                <div className="d-flex flex-row container">
                    <div className="col-6 col-sm-4 col-md-3 col-lg-2 d-flex flex-column vh-80 align-items-start m-3 bombo px-4 p-2">
                        <div className="d-flex flex-row mt-5">
                            <h4 className="d-flex text-white">Barátok</h4>
                            <div className="m-1">(  {smerosok.length} )</div>
                        </div>
                        {smerosok.length > 0 ? (
                            smerosok.map((ismeros, index) => (
                                <BaratokCard
                                    key={index}
                                    profilkep={`${BASE}/uploads/${ismeros.kep}`}
                                    felhasznalonev={ismeros.felhasznalo_nev}
                                    onClick={async () => {
                                        console.log("clicked:", ismeros.felhasznalo_id);

                                        setIsmerosId(ismeros.felhasznalo_id);
                                        setKivalasztottIsmerosKep(ismeros.kep);

                                        const res = await szobakeszites(ismeros.felhasznalo_id);

                                        if (res.result) {
                                            setSzobaId(res.szobaId);
                                        } else {
                                            alert(res.message || "Szerverhiba (szoba létrehozás)")
                                        }
                                    }
                                    }
                                />
                            ))
                        ) : (
                            <p>Nincsnek barataid :(</p>
                        )}
                    </div>

                    <div className="d-flex align-items-start bombo m-3" style={{ height: "815px", overflow: "overlay", scrollbarWidth: "none" }}>
                        <div className="flex-grow-1 d-flex flex-column h-100 p-3">
                            {/* ÜZENETEK */}
                            <div className="flex-grow-1">
                                {sortedUzenetek.map((msg, i) =>
                                    msg.felhasznalo_id === ismerosId ? (
                                        <UzenetekCard
                                            key={msg.id ?? i}
                                            balUzenet={msg.szoveg}
                                            balProfilkep={kivalasztottIsmerosKep ? `${BASE}/uploads/${kivalasztottIsmerosKep}` : undefined}
                                            jobbProfilkep={sajatKep ? `${BASE}/uploads/${sajatKep}` : undefined}
                                        />

                                    ) : (
                                        <UzenetekCard
                                            key={msg.id ?? i}
                                            jobbUzenet={msg.szoveg}
                                            balProfilkep={kivalasztottIsmerosKep ? `${BASE}/uploads/${kivalasztottIsmerosKep}` : undefined}
                                            jobbProfilkep={sajatKep ? `${BASE}/uploads/${sajatKep}` : undefined}
                                        />
                                    )
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* INPUT */}
                            <div className="d-flex p-2" style={{ maxWidth: "97%" }}>
                                <input
                                    className="form-control"
                                    placeholder="Üzenet..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                />
                                <button
                                    className="btn csetliColor me-auto"
                                    onClick={sendMessage}
                                >
                                    Küldés
                                </button>
>>>>>>> 047caf79a9b5c2ca89e345688faf037c58cd6784
                            </div>
                        </div>
                    </div>
                </div>
            </div>
<<<<<<< HEAD
        </>
=======
        </div>
>>>>>>> 047caf79a9b5c2ca89e345688faf037c58cd6784
    );
}