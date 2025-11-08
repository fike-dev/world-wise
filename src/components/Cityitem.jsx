import { Link } from "react-router-dom";
import styles from "./Cityitem.module.css";
import { useConsumeContext } from "../contexts/CitiesContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function Cityitem({ city }) {
  const { currentCity, deleteCity } = useConsumeContext();

  const {
    cityName,
    emoji,
    date,
    id,
    position: { lat, lng },
  } = city;

  function handleDelete(e) {
    e.preventDefault();
    deleteCity(id);
  }

  return (
    <li>
      <Link
        to={`${id}?lat=${lat}&lng=${lng}`}
        className={`${styles.cityItem} ${
          id === currentCity.id && styles["cityItem--active"]
        }`}
      >
        <span className={styles.emoji}>
          <img src={`https://flagsapi.com/${emoji}/flat/48.png`} alt="flag" />
        </span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)}) </time>
        <button className={styles.deleteBtn} onClick={handleDelete}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default Cityitem;
