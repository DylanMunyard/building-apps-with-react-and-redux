import React from "react";

type Props = {
    text: string
}

const Loading: React.FC<Props> = ({ text }) => {
    return (<div className="mt-3 row">
        <div className="col-1">
            <div className="spinner-border text-info" role="status">
                <span className="visually-hidden">{text}</span>
            </div>
        </div>
        <div className="col">
            <span className="align-middle">{text}</span>
        </div>
    </div>);
}

export default Loading;