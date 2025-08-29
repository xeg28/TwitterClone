import { useAlert } from "./AlertList/AlertContext";
const TempOne: React.FC = () => {
  const { addAlert } = useAlert();
  return (
    <div>
      <button onClick={() => addAlert("Error from component one", "error")}>Component one</button>
    </div>
  )
}

export default TempOne;