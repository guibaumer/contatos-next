import { ClipLoader } from "react-spinners"

export default function Loading() {
    return (
        <div className="global-loading-component">
            <ClipLoader size={50} />
        </div>
    )
}
