import React, { useEffect, useState, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { DialogContent } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    dialog: {
        backgroundColor: theme.palette.primary.main,
    },
    dialogContent: {
        backgroundColor: theme.palette.primary.main,
        padding: '0px 0px 100px 0px',
        width: '100vw',
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

    /* ── Layout ── */
    mainLayout: {
        marginLeft: '40px',
        marginTop: '40px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '80%',
    },

    /* ── Sidebar list (native DOM, no react-virtualized) ── */
    listContainer: {
        minWidth: '300px',
        maxWidth: '300px',
        paddingTop: '20px',
        flexShrink: 0,
    },
    list: {
        padding: '15px',
        boxShadow: '0px 0px 10px rgba(255, 255, 255, 0.2)',
        borderRadius: '10px',
        maxHeight: '600px',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
    listItem: {
        fontFamily: 'Roboto',
        fontSize: '1rem',
        fontWeight: 400,
        textTransform: 'none',
        color: 'white',
        padding: '4px 0',
        cursor: 'pointer',
        transition: 'color 0.2s ease',
        '&:hover': {
            fontWeight: 700,
        },
    },
    listItemSelected: {
        borderLeft: `2px solid ${theme.palette.common.gold}`,
        paddingLeft: '10px',
        color: theme.palette.common.gold,
        filter: 'brightness(150%)',
        fontWeight: 700,
        textShadow: '#6e5e08 1px 0 10px',
        animation: `$slideIn 400ms ease-out`,
    },

    /* ── Right column ── */
    rightColumn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        minWidth: 0,
    },

    /* ── Project detail (animated on switch) ── */
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
        fontSize: '2em',
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
        fontSize: '1.2em',
        textAlign: 'center',
        width: '70%',
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
        width: '721px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    detailMediaItem: {
        width: '100%',
        marginBottom: '10px',
        borderRadius: '5px',
    },

    /* ── Thumbnail gallery ── */
    thumbnailGalleryContainer: {
        width: '721px',
        marginTop: '20px',
    },
    thumbnailGalleryScroller: {
        display: 'flex',
        flexDirection: 'row',
        overflowX: 'auto',
        overflowY: 'hidden',
        gap: '8px',
        padding: '8px 0',
        '&::-webkit-scrollbar': {
            height: '4px',
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
        width: '80px',
        height: '52px',
        borderRadius: '4px',
        objectFit: 'cover',
        cursor: 'pointer',
        opacity: 0.5,
        border: '2px solid transparent',
        transition:
            'opacity 0.25s ease, border-color 0.25s ease, transform 0.2s ease',
        '&:hover': {
            opacity: 0.85,
            transform: 'scale(1.05)',
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
    '@keyframes slideIn': {
        from: { transform: 'translateX(-6px)' },
        to: { transform: 'translateX(0)' },
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProjectDetailComponent(props) {
    const { open, onClose, projectsData, onSelectItemFromList, project } =
        props;
    const classes = useStyles();

    const [projectDetail, setProjectDetail] = useState(undefined);
    const [projectVideos, setProjectVideos] = useState([]);

    // DOM refs — no react-virtualized, so scrolling actually works
    const thumbnailScrollerRef = useRef(null);
    const listContainerRef = useRef(null);
    const listItemRefs = useRef({});
    // Track whether selection came from thumbnail gallery or sidebar list
    const selectionSource = useRef('list'); // 'list' | 'thumbnail'

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
        if (!project || !thumbnailScrollerRef.current) return;
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

    // ── Center the sidebar list item vertically (only from thumbnail clicks) ──
    useEffect(() => {
        if (!project || selectionSource.current !== 'thumbnail') return;
        const el = listItemRefs.current[project.id];
        const container = listContainerRef.current;
        if (!el || !container) return;

        const targetScroll =
            el.offsetTop -
            container.offsetHeight / 2 +
            el.offsetHeight / 2;
        container.scrollTo({ top: targetScroll, behavior: 'smooth' });

        selectionSource.current = 'list'; // reset
    }, [project]);

    // ── Handlers ──
    const handleThumbnailClick = useCallback(
        (index) => {
            selectionSource.current = 'thumbnail';
            onSelectItemFromList(index);
        },
        [onSelectItemFromList]
    );

    const handleListClick = useCallback(
        (index) => {
            selectionSource.current = 'list';
            onSelectItemFromList(index);
        },
        [onSelectItemFromList]
    );

    const handleClose = () => onClose();

    // ── Ref callback for list items ──
    const setListItemRef = useCallback((id, el) => {
        if (el) listItemRefs.current[id] = el;
    }, []);

    return (
        <div>
            <Dialog
                fullScreen
                fullWidth={true}
                open={open}
                TransitionComponent={Transition}
                className={classes.dialog}
            >
                <DialogContent
                    className={classes.dialogContent}
                    classes={{ root: classes.dialogContentRoot }}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>

                    <div className={classes.mainLayout}>
                        {/* ── Sidebar list ── */}
                        <div className={classes.listContainer}>
                            <div
                                className={classes.list}
                                ref={listContainerRef}
                            >
                                {projectsData.map((proj, index) => (
                                    <div
                                        key={proj.id}
                                        ref={(el) =>
                                            setListItemRef(proj.id, el)
                                        }
                                        className={clsx(
                                            classes.listItem,
                                            proj.id === project?.id &&
                                                classes.listItemSelected
                                        )}
                                        onClick={() => handleListClick(index)}
                                    >
                                        {proj.altTitle ?? proj.title}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Right column ── */}
                        <div className={classes.rightColumn}>
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
                                    <div
                                        className={
                                            classes.detailMediaContainer
                                        }
                                    >
                                        {projectVideos.map((video, i) => (
                                            <iframe
                                                key={i}
                                                className={
                                                    classes.detailMediaItem
                                                }
                                                src={video.data.src}
                                                width={
                                                    video.data.width ?? 721
                                                }
                                                height={
                                                    video.data.height ?? 405
                                                }
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
                                            ?.filter(
                                                (m) => m.type === 'img'
                                            )
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
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
