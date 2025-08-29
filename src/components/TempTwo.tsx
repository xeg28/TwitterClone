import { useAlert } from "./AlertList/AlertContext";
const TempTwo: React.FC = () => {
  const { addAlert } = useAlert();
  return (
    <div>
      <button onClick={() => addAlert("Error from component two", "error")}>Component two</button>
    </div>
  )
}

export default TempTwo;