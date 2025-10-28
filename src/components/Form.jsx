// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import styles from "./Form.module.css";

import Button from "./Button";
import BackButton from "./BackButton";
import useURLPosition from "../hooks/useURLPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import { useConsumeContext } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  if (!countryCode) return;
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [lat, lng] = useURLPosition();

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState({});
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [geaocodingError, setGeocodingError] = useState("");

  const { createCity, isLoading } = useConsumeContext();
  const navigate = useNavigate();

  useEffect(
    function () {
      async function fetchData() {
        try {
          if (!lat || !lng)
            throw new Error("Start by clicking somewhere on the map.");

          setIsLoadingGeocoding(true);
          setGeocodingError("");
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          // console.log(data);

          if (!data.countryCode)
            throw new Error(
              "That doesn't seem to be a city. Click somewhere else 😔"
            );
          setCityName(data.city || data.locality || "");
          setCountry({ name: data.countryName, countryCode: data.countryCode });
        } catch (err) {
          setGeocodingError(err.message);
        } finally {
          setIsLoadingGeocoding(false);
        }
      }

      fetchData();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country: country.name,
      emoji: country.countryCode,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };

    await createCity(newCity);

    navigate("/app/cities");
  }

  if (isLoadingGeocoding) return <Spinner />;

  if (geaocodingError) return <Message message={geaocodingError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>
          {convertToEmoji(country.countryCode)}
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
