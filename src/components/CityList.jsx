import Cityitem from "./Cityitem";
import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useConsumeContext } from "../contexts/CitiesContext";

function CityList() {
  const { cities, isLoading } = useConsumeContext();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message
        message={"Add your first city by clicking on a city on the map."}
      />
    );

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <Cityitem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
