import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumbs.css'
export type Breadcrumb = {
    name: string,
    url: string
}
interface BreadcrumbProps {
    paths: Breadcrumb[]
}
const Breadcrumbs = ({ paths }: BreadcrumbProps) => {
    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                {paths.map((path, index) => (
                    <li key={index} className="breadcrumb-item">
                        {index === paths.length - 1 ? (
                            <span>{path.name}</span>
                        ) : (
                            <Link to={path.url}>{path.name}</Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
