import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ArrowRight from '@material-ui/icons/ArrowRight';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import Slide from '@material-ui/core/Slide';
import { DialogContent } from '@material-ui/core';
import clsx from 'clsx';

const projectWidth = window.innerWidth * 0.9;
const projectHeight = projectWidth / 1.53;

const useStyles = makeStyles((theme) => ({
    dialog: {
        backgroundColor: theme.palette.primary.main,
    },
    dialogContent: {
        width: '100vw',
        backgroundColor: theme.palette.primary.main,
        padding: '0px 0px 50px 0px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        // scrollY: 'auto'
    },
    dialogContentRoot: {
        '&:first-child': {
            paddingTop: '0px',
        },
    },
    projectDetailContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '20px',
        width: '100%',
        animation: `$fade 1500ms ease-out`, // Need assigned key on component to work
    },
    appBar: {
        position: 'relative',
        // position: 'absolute',
        // overflow: 'hidden',
        // top: 0,
        // backgroundColor: 'red',
        // left: 0,

        // top: 'auto',
        // bottom: 0,
        // float: 'left',
        // display: 'block',
    },
    projectDetailContainer: {
        // border: '2px solid red',
        // marginLeft: '40px',
        // marginTop: '40px',
        // width: '95%',
        display: 'flex',
        flexDirection: 'row',
        // flex: 'space-between',
        justifyContent: 'flex-start',
        // width: '80%',
    },

    title: {
        fontSize: '1.5em',
        textAlign: 'center',
        marginBottom: '3px',
        fontWeight: 500,
    },
    year: {
        fontSize: '1rem',
        fontWeight: '300',
    },
    subtitle: {
        padding: '0px 2em',
        fontSize: '1.0em',
        textAlign: 'center',
        width: '90%',
        marginBottom: '10px',
        fontWeight: 400,
    },
    categoriesText: {
        padding: '0px 2em',
        fontSize: '1.0em',
        marginBottom: '20px',
        width: '80%',
        textAlign: 'center',
    },
    separator: {
        backgroundColor: theme.palette.common.gold,
        height: '3px',
        width: '30px',
        margin: '10px 0',
    },
    separator2: {
        backgroundColor: theme.palette.secondary.main,
        height: '0.5px',
        width: '60%',
        marginBottom: '10px',
    },
    detailMediaContainer: {
        width: projectWidth,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    detailMediaItem: {
        width: projectWidth,
        marginBottom: '10px',
        borderRadius: '5px',
    },
    thumbnailGalleryContainer: {
        width: projectWidth,
        marginTop: '16px',
        position: 'relative',
    },
    thumbnailGalleryScroller: {
        display: 'flex',
        flexDirection: 'row',
        overflowX: 'auto',
        overflowY: 'hidden',
        gap: '6px',
        padding: '6px 0',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        '&::-webkit-scrollbar': {
            height: '3px',
        },
        '&::-webkit-scrollbar-track': {
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '2px',
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '2px',
        },
    },
    thumbnailItem: {
        flex: '0 0 auto',
        width: '60px',
        height: '40px',
        borderRadius: '3px',
        objectFit: 'cover',
        cursor: 'pointer',
        opacity: 0.5,
        border: '2px solid transparent',
        transition: 'opacity 0.2s ease, border-color 0.2s ease',
        '&:hover': {
            opacity: 0.85,
        },
    },
    thumbnailItemSelected: {
        opacity: 1,
        borderColor: theme.palette.common.gold,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProjectDetailComponentMobile(props) {
    const { open, onClose, onNavigate, project, projectsData, onSelectItemFromList } = props;
    const classes = useStyles();

    const [projectDetail, setProjectDetail] = useState(undefined);
    const [projectVideos, setProjectVideos] = useState([]);
    const thumbnailScrollerRef = useRef(null);

    useEffect(() => {
        setProjectDetail(project);
        if (project?.extraMedia) {
            setProjectVideos(
                project.extraMedia?.filter((em) => em.type === 'video')
            );
        } else {
            setProjectVideos([]);
        }
    }, [project]);

    // Always center the selected thumbnail in the gallery
    useEffect(() => {
        if (project && projectsData && thumbnailScrollerRef.current) {
            const selectedIndex = projectsData.findIndex(p => p.id === project.id);
            const scroller = thumbnailScrollerRef.current;
            const thumb = scroller.children[selectedIndex];
            if (thumb) {
                const thumbLeft = thumb.offsetLeft;
                const thumbWidth = thumb.offsetWidth;
                const scrollerWidth = scroller.offsetWidth;
                scroller.scrollTo({
                    left: thumbLeft - scrollerWidth / 2 + thumbWidth / 2,
                    behavior: 'smooth',
                });
            }
        }
    }, [project, projectsData]);

    const handleThumbnailClick = (index) => {
        if (onSelectItemFromList) {
            onSelectItemFromList(index);
        }
    };

    const handleClose = () => {
        onClose();
    };

    const handleNavigate = (direction) => () => {
        onNavigate(direction);
    };

    return (
        <div className={classes.container}>
            <Dialog
                fullScreen
                // fullWidth={true}
                open={open}
                TransitionComponent={Transition}
                className={classes.dialog}
            >
                <DialogContent
                    className={classes.dialogContent}
                    classes={{ root: classes.dialogContentRoot }}
                >
                    <AppBar className={classes.appBar} position="fixed">
                        <Toolbar
                            style={{
                                width: 'auto',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={handleClose}
                                    aria-label="close"
                                >
                                    <CloseIcon />
                                </IconButton>
                            </div>
                            <div>
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={handleNavigate('left')}
                                    aria-label="Navigate Left"
                                >
                                    <ArrowLeft />
                                </IconButton>
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={handleNavigate('right')}
                                    aria-label="Navigate Right"
                                    style={{ marginLeft: '20px' }}
                                >
                                    <ArrowRight />
                                </IconButton>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <div className={classes.projectDetailContainer}>
                        {projectDetail && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                <div
                                    className={classes.projectDetailContent}
                                    key={projectDetail.id}
                                >
                                    <Typography
                                        className={classes.title}
                                        variant={'h2'}
                                    >
                                        {projectDetail.title}
                                    </Typography>
                                    {/* <Typography
                                        className={classes.year}
                                        variant={'h6'}
                                    >
                                        ({projectDetail.year})
                                    </Typography> */}
                                    <div className={classes.separator}></div>
                                    <Typography
                                        className={classes.subtitle}
                                        variant={'subtitle2'}
                                    >
                                        {projectDetail.detailedSubtitle ??
                                            projectDetail.subtitle}
                                    </Typography>
                                    <div className={classes.separator2}></div>
                                    <Typography
                                        className={classes.categoriesText}
                                        variant={'subtitle2'}
                                    >
                                        {projectDetail.categoriesText}
                                    </Typography>
                                    <div className={classes.detailMediaContainer}>
                                        {projectVideos.length > 0 &&
                                            projectVideos.map((video) => {
                                                return (
                                                    <>
                                                        <iframe
                                                            className={
                                                                classes.detailMediaItem
                                                            }
                                                            src={video.data.src}
                                                            width={projectWidth}
                                                            height={projectHeight}
                                                            frameborder="0"
                                                            allow="autoplay; fullscreen; picture-in-picture"
                                                            allowFullScreen
                                                            title={
                                                                projectDetail.title
                                                            }
                                                        ></iframe>
                                                    </>
                                                );
                                            })}
                                        {projectDetail.bgImg &&
                                            !projectDetail.hideLogo && (
                                                <img
                                                    src={projectDetail.bgImg}
                                                    className={
                                                        classes.detailMediaItem
                                                    }
                                                    alt="Project"
                                                />
                                            )}
                                        {projectDetail.extraMedia &&
                                            projectDetail.extraMedia.map(
                                                (media, index) => {
                                                    if (media.type === 'img') {
                                                        return (
                                                            <img
                                                                src={media.data}
                                                                className={
                                                                    classes.detailMediaItem
                                                                }
                                                                alt="media item"
                                                                key={index}
                                                            />
                                                        );
                                                    } else return <></>;
                                                }
                                            )}
                                    </div>
                                </div>
                                {/* Horizontal thumbnail gallery - outside keyed div so it persists */}
                                {projectsData && (
                                    <div className={classes.thumbnailGalleryContainer}>
                                        <div
                                            className={classes.thumbnailGalleryScroller}
                                            ref={thumbnailScrollerRef}
                                        >
                                            {projectsData.map((proj, index) => (
                                                <img
                                                    key={proj.id}
                                                    src={proj.bgImg}
                                                    alt={proj.title}
                                                    className={clsx(
                                                        classes.thumbnailItem,
                                                        proj.id === project?.id &&
                                                            classes.thumbnailItemSelected
                                                    )}
                                                    onClick={() => handleThumbnailClick(index)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
