import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import logo1 from '../Media/logo1.jpg';
import { Paper, Fab, Button, Snackbar } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useHistory } from 'react-router-dom';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

function Singlepost(props) {
    let { id } = useParams();
    let history = useHistory();

    const [anchorEl, setAnchorEl] = useState(null);
    const [comtext, setComtext] = useState("")
    const [model, setModel] = useState(false);
    const [image, setImage] = useState(null);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [textError, setTextError] = useState(null);
    const [snackText, setSnackText] = useState("");
    const [valid, setValid] = useState(false);
    const [postId, setpostId] = useState("")

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleModelclose = () => {
        setModel(false);
    };

    const handleComment = (text, userId, postId) => {
        props.commentPost(text, userId, postId)
        setComtext("");
    }

    const handleViewAndDelete = (id, isUser, postId) => {
        if (!isUser) {
            history.push(`/user/${id}`);
        } else {
            //console.log(postId);
            props.deletePost(postId);
            setAnchorEl(null);
        }
    }

    const handleEditAndFollow = (id, isUser, post) => {
        if (!isUser) {
            history.push(`/user/${id}`);
        } else {
            setModel(true);
            setpostId(post._id)
            setAnchorEl(null);
            setImage(post.img);
            setText(post.desc);
        }
    }

    const uploadImageURL = (item) => {
        try {
            return URL.createObjectURL(item)
        } catch (error) {
            return item
        }
    }

    let Post = [];
    Post = props.posts.filter((post) => post._id === id);
    if (Post.length === 0) {
        history.replace('/');
    }

    const updatePost = () => {
        if (valid) {
            const data = new FormData();
            data.append('file', image);
            data.append('upload_preset', "SocialMedia");
            data.append('cloud_name', "djqrcbjmu");

            let validData = true;

            if (text.length < 2) {
                validData = false;
                setTextError("At least two letters");
                return;
            } else {
                validData = true;
                setTextError(null);
            }

            if (image === null) {
                validData = false;
                setOpen(true);
                setSnackText("image Required")
                return;
            } else {
                validData = true;
                setOpen(false);
            }

            if (validData) {
                setOpen(true);
                setSnackText("Posting...");
                fetch("	https://api.cloudinary.com/v1_1/djqrcbjmu/image/upload", {
                    method: "post",
                    body: data
                })
                    .then(res => res.json())
                    .then(data => {
                        const Data = {};
                        Data["desc"] = text;
                        Data["img"] = data.secure_url
                        setOpen(true);
                        setSnackText("Posted yayu");
                        setImage(null);
                        setText("");
                        props.updatePost(postId, Data);
                        setModel(false);
                        setOpen(false)
                    })
                    .catch(err => console.log(err));
            }
        }
        else {
            setModel(false);
        }
    }

    return (
        <div>
            {
                Post[0] ?
                    <div data-aos="fade-up-right" style={{ maxWidth: "600px", margin: "20px auto", zIndex: "1" }}>
                        <Paper elevation={3} style={{ padding: "20px", margin: "10px", backgroundColor: "rgba(255,255,255,0.3)" }}>
                            <div style={{ marginBottom: "20px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} >
                                <div onClick={() => history.push(`/user/${Post[0].postedBy._id}`)} style={{ display: "flex", flexDirection: "row", cursor: "pointer", alignItems: "center" }}>
                                    <img alt="logo" src={Post[0]?.postedBy?.img} height="45px" width="45px" style={{ objectFit: "cover", borderRadius: "50%", marginRight: "10px" }} />
                                    <h4><b>{Post[0].postedBy.name}</b></h4>
                                </div>
                                <div>
                                    <Fab style={{ backgroundColor: "#fff", boxShadow: "none" }}>
                                        <MoreVertIcon onClick={handleClick} />
                                    </Fab>
                                </div>
                            </div>
                            <div>
                                <img width="100%" height="350px" style={{ objectFit: "cover", cursor: "pointer" }} alt="img" src={Post[0].img} />
                            </div>
                            <div style={{ marginBottom: "6px" }}>
                                <Fab size="small" style={{ backgroundColor: "#fff", boxShadow: "none", marginRight: "-2px" }}>
                                    <span style={{ fontSize: "25px" }}>{Post[0].likes.length}</span>
                                </Fab>
                                {
                                    !Post[0].likes.includes(props.userId) ?
                                        <Fab size="small" style={{ backgroundColor: "#fff", boxShadow: "none", marginRight: "0px" }}>
                                            <ThumbUpAltIcon onClick={() => props.like(Post[0]._id)} style={{ cursor: "pointer" }} />
                                        </Fab>
                                        :
                                        <Fab size="small" style={{ backgroundColor: "#fff", boxShadow: "none", marginRight: "0px" }}>
                                            <ThumbDownAltIcon onClick={() => props.like(Post[0]._id)} style={{ cursor: "pointer" }} />
                                        </Fab>
                                }
                                <Fab size="small" style={{ backgroundColor: "#fff", boxShadow: "none", marginRight: "0px" }}>
                                    <FavoriteIcon onClick={() => props.like(Post[0]._id)} style={{ cursor: "pointer" }} />
                                </Fab>
                                <Fab size="small" style={{ backgroundColor: "#fff", boxShadow: "none", float: "right", marginRight: "0px" }}>
                                    <BookmarkIcon onClick={() => props.save(Post[0]._id)} style={{ cursor: "pointer" }} />
                                </Fab>
                            </div>
                            <div style={{ marginBottom: "15px" }}>
                                <b>{Post[0].postedBy.name}</b> {Post[0].desc}
                            </div>
                            <div >
                                {Post[0].comments.map((comment, index) => (
                                    <p key={index}><span style={{ fontWeight: "bold" }}>{comment.commentedBy.name} </span>{comment.text}</p>
                                ))}
                            </div>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <TextField
                                    value={comtext}
                                    onChange={(e) => setComtext(e.target.value)}
                                    fullWidth
                                    placeholder="leave comment..." />
                                <SendIcon
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        handleComment(comtext,
                                            Post[0].postedBy._id, Post[0]._id)} />
                            </div>
                        </Paper>
                        <Menu
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => handleViewAndDelete(Post[0].postedBy._id, props.userId === Post[0].postedBy._id, Post[0]._id)}>{props.userId === Post[0].postedBy._id ? "delete post" : "view profile"} </MenuItem>
                            <MenuItem onClick={() => handleEditAndFollow(Post[0].postedBy._id, props.userId === Post[0].postedBy._id, Post[0])}>{props.userId === Post[0].postedBy._id ? "edit post" : "follow"}</MenuItem>
                        </Menu>
                        <Dialog style={{ margin: "-20px" }} onClose={handleModelclose} aria-labelledby="customized-dialog-title" open={model}>
                            <DialogTitle id="customized-dialog-title" onClose={handleModelclose}>
                                <b>Edit Post</b>
                            </DialogTitle>
                            <DialogContent dividers>
                                <p style={{ opacity: "0.7" }}><b>NOTE: </b>High resolution image takes much to upload, please be patient</p><br />
                                <input type="file" onChange={(e) => { setImage(e.target.files[0]); setValid(true) }} /><br /><br />
                                <img width="300px" height="300px" style={{ textAlign: "center", objectFit: "cover", cursor: "pointer" }} alt="img" src={uploadImageURL(image)} />
                                <br /><br />
                                <TextField
                                    error={textError !== null}
                                    helperText={textError}
                                    label="Enter Text"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    variant="outlined"
                                    value={text}
                                    onChange={(e) => { setText(e.target.value); setValid(true) }}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button autoFocus onClick={() => updatePost()} color="primary">
                                    Update Post
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Snackbar
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            open={open}
                            autoHideDuration={3000}
                            onClose={handleClose}
                            message={snackText}
                        />
                    </div>
                    :
                    <h1 style={{ textAlign: "center" }}>Loading...</h1>
            }
        </div>
    )
}

export default Singlepost
