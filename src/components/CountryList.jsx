import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Spinner from "./Spinner";
import Message from "./Message";
import { useConsumeContext } from "../contexts/CitiesContext";

function CountryList() {
  const { cities, isLoading } = useConsumeContext();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message
        message={"Add your first city by clicking on a city on the map."}
      />
    );
  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);
  return (
    <ul className={styles.countryList}>
      {countries.map((country, i) => (
        <CountryItem country={country} key={i} />
      ))}
    </ul>
  );
}

export default CountryList;
