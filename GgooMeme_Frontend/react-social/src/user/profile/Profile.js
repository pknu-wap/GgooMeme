import React, { Component } from 'react';
import './Profile.css';
import { request } from "../../util/APIUtils";
import { API_BASE_URL } from '../../constants';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookmarkedImages: [],
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchBookmarkedImages();
    }

    fetchBookmarkedImages = () => {
        // 사용자의 북마크한 이미지를 가져오는 요청
        request({
            url: `${API_BASE_URL}/mypage/bookmark`,
            method: "GET",
        })
        .then(data => {
            console.log("Received bookmarked images:", data);
            this.setState({
                bookmarkedImages: data.postPreviewDtos, // postPreviewDtos를 사용하여 이미지 정보를 가져옵니다.
                loading: false,
                error: null
            });
        })
        .catch(error => {
            this.setState({
                loading: false,
                error: error.message
            });
        });
    };
    

    render() {
        const { bookmarkedImages, loading, error } = this.state;
        const { currentUser } = this.props;

        if (loading) {
            return <div className="loading">Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        return (
            <div>
                <div className="profile-container">
                    <div className="container">
                        <div className="profile-info">
                            <div className="profile-avatar">
                                { 
                                    currentUser && currentUser.imageUrl ? (
                                        <img src={currentUser.imageUrl} alt={currentUser.name}/>
                                    ) : (
                                        <div className="text-avatar">
                                            <span>{currentUser && currentUser.name ? this.props.currentUser.name : ""}</span>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="profile-name">
                            <h2>{currentUser && currentUser.name ? currentUser.name : "avatar"}님, 안녕하세요</h2>
                            <p className="profile-email">{currentUser && currentUser.email ? currentUser.email : ""}</p>
                            </div>
                        </div>
                    </div>    
                </div>
                <div className="bookmarked-images">
                            <h3>북마크한 이미지</h3>
                            <div className="image-list">
                                {bookmarkedImages.map(image => (
                                    <div key={image.postId} className="image-item">
                                        <img src={image.postImage} alt={`Bookmark ${image.postId}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
            </div>
        );
    }
}

export default Profile;
