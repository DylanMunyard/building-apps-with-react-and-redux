import React from "react";
import ptn, { Tv } from 'parse-torrent-name';
import fanArt from "../../assets//media-details/fanart.png";

type Props = {
    name: string
}

const Loading: React.FC<Props> = ({ name }) => {
    const details = ptn(name);

    // Clear every after season number: expecting <Title> s01 | <Title> s02-s03 | <Title> Season 1
    const seasonMatch = details.title.match(/s(?<short>\d{1,2}).*|season (?<long>\d{1,2}).*/i);
    if (seasonMatch) {
        const { "short": shortSeason, "long": longSeason } = seasonMatch.groups as { [key: string]: string };
        (details as Tv).season = parseInt(shortSeason ?? longSeason, 10);
    }
    
    details.title = details.title.replace(/s\d{1,2}.*/i, "");
    details.title = details.title.replace(/season \d{1,2}.*/i, "");
    
    // Clear year numbers from the end of the title: expecting <Title> 2021
    details.title = details.title.replace(/\d{4}$/i, "");
    
    // Remove excess whitespace
    details.title = details.title.trim();

    const tv = details as Tv;

    let title = `Full Season ${tv.season}`;
    if (tv.episode) {
        title = `Episode ${tv.episode} / Season ${tv.season}`;
    }

    return (<>
        {tv.season && 
        <div className="card" style={{width: "18rem"}}>
            <img src={fanArt} className="card-img-top" alt={tv.title} />      
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{tv.title}</p>
                <a href="#" className="btn btn-primary">TheTVDB.com</a>
            </div>
        </div>}
    </>);
}

export default Loading;