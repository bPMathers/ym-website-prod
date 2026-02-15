import React, { useEffect, useState, useRef, useCallback } from 'react';
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
    },
    dialogContentRoot: {
        '&:first-child': {
            paddingTop: '0px',
        },
    },
    appBar: {
        position: 'relative',
    },
    projectDetailContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },

    /* ── Detail content (animated per project) ── */
    projectDetailContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '20px',
        width: '100%',
        animation: `$fadeIn 800ms ease-out`,
    },
    title: {
        fontSize: '1.5em',
        textAlign: 'center',
        marginBottom: '3px',
        fontWeight: 500,
    },
    separator: {
        backgroundColor: theme.palette.common.gold,
        height: '3px',
        width: '30px',
        margin: '10px 0',
    },
    subtitle: {
        padding: '0px 2em',
        fontSize: '1.0em',
        textAlign: 'center',
        width: '90%',
        marginBottom: '10px',
        fontWeight: 400,
    },
    separator2: {
        backgroundColor: theme.palette.secondary.main,
        height: '0.5px',
        width: '60%',
        marginBottom: '10px',
    },
    categoriesText: {
        padding: '0px 2em',
        fontSize: '1.0em',
        marginBottom: '20px',
        width: '80%',
        textAlign: 'center',
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

    /* ── Thumbnail gallery ── */
    thumbnailGalleryContainer: {
        width: projectWidth,
        marginTop: '16px',
    },
    thumbnailGalleryScroller: {
        display: 'flex',
        flexDirection: 'row',
        overflowX: 'auto',
        overflowY: 'hidden',
        gap: '6px',
        padding: '6px 0',
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
        transition: 'opacity 0.25s ease, border-color 0.25s ease',
        '&:hover': {
            opacity: 0.85,
        },
    },
    thumbnailItemSelected: {
        opacity: 1,
        borderColor: theme.palette.common.gold,
    },

    /* ── Animations ── */
    '@keyframes fadeIn': {
        from: { opacity: 0 },
        to: { opacity: 1 },
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProjectDetailComponentMobile(props) {
    const {
        open,
        onClose,
        onNavigate,
        project,
        projectsData,
        onSelectItemFromList,
    } = props;
    const classes = useStyles();

    const [projectDetail, setProjectDetail] = useState(undefined);
    const [projectVideos, setProjectVideos] = useState([]);
    const thumbnailScrollerRef = useRef(null);

    // ── Sync detail state ──
    useEffect(() => {
        setProjectDetail(project);
        if (project?.extraMedia) {
            setProjectVideos(
                project.extraMedia.filter((em) => em.type === 'video')
            );
        } else {
            setProjectVideos([]);
        }
    }, [project]);

    // ── Center the selected thumbnail in the strip ──
    useEffect(() => {
        if (!project || !projectsData || !thumbnailScrollerRef.current) return;
        const selectedIndex = projectsData.findIndex(
            (p) => p.id === project.id
        );
        if (selectedIndex === -1) return;
        const scroller = thumbnailScrollerRef.current;
        const thumb = scroller.children[selectedIndex];
        if (!thumb) return;
        const scrollLeft =
            thumb.offsetLeft -
            scroller.offsetWidth / 2 +
            thumb.offsetWidth / 2;
        scroller.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }, [project, projectsData]);

    const handleThumbnailClick = useCallback(
        (index) => {
            if (onSelectItemFromList) onSelectItemFromList(index);
        },
        [onSelectItemFromList]
    );

    const handleClose = () => onClose();
    const handleNavigate = (direction) => () => onNavigate(direction);

    return (
        <div>
            <Dialog
                fullScreen
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
                        {/* Detail content — keyed by id for fade animation */}
                        {projectDetail && (
                            <div
                                className={classes.projectDetailContent}
                                key={projectDetail.id}
                            >
                                <Typography
                                    className={classes.title}
                                    variant="h2"
                                >
                                    {projectDetail.title}
                                </Typography>
                                <div className={classes.separator} />
                                <Typography
                                    className={classes.subtitle}
                                    variant="subtitle2"
                                >
                                    {projectDetail.detailedSubtitle ??
                                        projectDetail.subtitle}
                                </Typography>
                                <div className={classes.separator2} />
                                <Typography
                                    className={classes.categoriesText}
                                    variant="subtitle2"
                                >
                                    {projectDetail.categoriesText}
                                </Typography>
                                <div className={classes.detailMediaContainer}>
                                    {projectVideos.map((video, i) => (
                                        <iframe
                                            key={i}
                                            className={classes.detailMediaItem}
                                            src={video.data.src}
                                            width={projectWidth}
                                            height={projectHeight}
                                            frameBorder="0"
                                            allow="autoplay; fullscreen; picture-in-picture"
                                            allowFullScreen
                                            title={projectDetail.title}
                                        />
                                    ))}
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
                                    {projectDetail.extraMedia
                                        ?.filter((m) => m.type === 'img')
                                        .map((media, i) => (
                                            <img
                                                key={i}
                                                src={media.data}
                                                className={
                                                    classes.detailMediaItem
                                                }
                                                alt="media item"
                                            />
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Thumbnail gallery — always mounted, never remounts */}
                        {projectsData && (
                            <div
                                className={
                                    classes.thumbnailGalleryContainer
                                }
                            >
                                <div
                                    className={
                                        classes.thumbnailGalleryScroller
                                    }
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
                                            onClick={() =>
                                                handleThumbnailClick(index)
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
