import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '90%',
        maxWidth: '800px',
    },
    title: {
        color: theme.palette.common.gold,
        fontSize: '1.5em',
        letterSpacing: 3,
        marginBottom: '10px',
        marginTop: '30px',
    },
    pointRow: {
        marginBottom: '15px',
    },
    pointRowText: {
        fontSize: '0.95em',
    },
    point: {
        color: theme.palette.common.gold,
        marginRight: '8px',
    },
    link: {
        color: '#F5EE9E',
        textDecoration: 'none',
        fontWeight: 700,
    },
}));

const BenjPointFormComponent = () => {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <Typography variant="h2" className={classes.title}>
                MUSICAL EXPERIENCE HIGHLIGHTS
            </Typography>
            <div className={classes.pointRow}>
                <Typography variant="body2" className={classes.pointRowText}>
                    <span className={classes.point}>•</span>Composer at YUL MUSIC, creating music for Cirque du Soleil, Moment Factory, Sid Lee, Loto Québec, Bombardier Aerospace, One Drop Foundation, LAX, and the NBA.
                </Typography>
            </div>
            <div className={classes.pointRow}>
                <Typography variant="body2" className={classes.pointRowText}>
                    <span className={classes.point}>•</span>Composition, arrangements, and sound design for Cirque du Soleil's acro-culinary show <em>Bocca</em>, directed by Pierre Lapointe at Casino de Monte-Carlo (2019).
                </Typography>
            </div>
            <div className={classes.pointRow}>
                <Typography variant="body2" className={classes.pointRowText}>
                    <span className={classes.point}>•</span>Musical composition, sound design, and spatialization for Moment Factory's <em>Mystic Tree Show</em> at Songcheng Park, Hangzhou, China (2017).
                </Typography>
            </div>
            <div className={classes.pointRow}>
                <Typography variant="body2" className={classes.pointRowText}>
                    <span className={classes.point}>•</span>Guitarist, banjoist, arranger, co-producer and tour manager for the band <strong>Canailles</strong> — 3 albums, 500+ concerts, 10 European tours, GAMIQ Show of the Year award winner (2012).
                </Typography>
            </div>
            <div className={classes.pointRow}>
                <Typography variant="body2" className={classes.pointRowText}>
                    <span className={classes.point}>•</span>Sound exploration for NFB animated short film <em>Aphasie</em> by Marielle Dalpé (2022-2023) and sound design for <em>Sans Objets</em> by Moïa Jobin-Paré (2018-2019).
                </Typography>
            </div>
            <div className={classes.pointRow}>
                <Typography variant="body2" className={classes.pointRowText}>
                    <span className={classes.point}>•</span>Keyboardist for Klô Pelgag's Japan tour (2022), guest saxophonist on Lee Paradise's <em>&CO</em> (2022), and guitarist on Phèdre's <em>Eterna</em> (2020).
                </Typography>
            </div>
            <div className={classes.pointRow}>
                <Typography variant="body2" className={classes.pointRowText}>
                    <span className={classes.point}>•</span>Sound manager, co-composer, and live performer for the theatre piece <em>Rafales</em> by Théâtre Incliné — 41 performances across France, Acadia, and Quebec.
                </Typography>
            </div>
            <div className={classes.pointRow}>
                <Typography variant="body2" className={classes.pointRowText}>
                    <span className={classes.point}>•</span>Musical director and conductor for percussion troupe <strong>Kumpa'nia</strong> (2006-2009) — 500+ shows across Quebec, Ontario, and France.
                </Typography>
            </div>
            <div className={classes.pointRow}>
                <Typography variant="body2" className={classes.pointRowText}>
                    <span className={classes.point}>•</span>Film scores and studio work including projects with Robert Marcel Lepage, Olivier Bélisle, Bernard Adamus, and various film composers.
                </Typography>
            </div>
        </div>
    );
};

export default BenjPointFormComponent;
