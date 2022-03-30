import React from 'react';

const PageNotFound: React.FC = () => {
    return (
        <div className="p-5 mb-4 bg-primary text-white rounded-3">
            <div className="container-fluid py-5">
                <h1 className="display-5 fw-bold">Oops!</h1>
                <p className="col-md-8 fs-4">Page not found.</p>
            </div>
        </div>
    );
}

export default PageNotFound;