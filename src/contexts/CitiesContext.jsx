import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const CitiesContext = createContext();

const BASE_URL = `http://localhost:8000`;

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payLoad };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payLoad],
        currentCity: action.payLoad,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payLoad),
        currentCity: {},
      };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payLoad };
    case "rejected":
      return { ...state, isLoading: false, error: action.payLoad };
    default:
      throw new Error("Unknown action type.");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchData() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();

        dispatch({ type: "cities/loaded", payLoad: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payLoad: "There was an error loading data.",
        });
      }
    }
    fetchData();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (id === currentCity.id) return;

      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();

        dispatch({ type: "city/loaded", payLoad: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payLoad: "There was an error loading City data.",
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      dispatch({ type: "city/created", payLoad: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payLoad: "There was an Error creating the city",
      });
    }
  }

  async function deleteCity(id) {
    if (!id) return;
    try {
      dispatch({ type: "loading" });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      // console.log(data);
      dispatch({ type: "city/deleted", payLoad: id });
    } catch (err) {
      dispatch({
        type: "rejected",
        payLoad: "There was an Error deleting the city",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        createCity,
        isLoading,
        currentCity,
        error,
        getCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useConsumeContext() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used out side of the CitiesProvider.");
  return context;
}

export { CitiesProvider, useConsumeContext };
