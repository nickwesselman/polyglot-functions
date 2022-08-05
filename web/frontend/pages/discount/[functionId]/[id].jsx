import { useParams } from "react-router-dom";

export default function DiscountPage() {
    const { functionId, id } = useParams();
    return <div>
        <ul>
            <li>functionId: {functionId}</li>
            <li>id: {id}</li>
        </ul>
    </div>
}