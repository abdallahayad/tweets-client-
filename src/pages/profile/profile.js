import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import EditBio from '../../components/EditBio/EditBio';
import styles from './profile.module.css';
import { editProfileImage } from '../../redux/actions/dataActions';
class profile extends Component {
  state = {
    showEditForm: false,
    image: null,
  };
  openEditForm = () => {
    this.setState({ showEditForm: true });
  };
  closeEditForm = () => {
    this.setState({ showEditForm: false });
  };
  openFileInput = () => {
    document.getElementById('edit-pic').click();
  };
  onImageChange = (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image, image.name);
    this.props.editProfileImageAction(formData, this.props.history);
  };
  static getDerivedStateFromProps(props, state) {
    if (props.userData) {
      if (state.image !== props.userData.credentials.profileImage) {
        return {
          ...state,
          image: props.userData.credentials.profileImage,
        };
      }
    }
    return null;
  }
  render() {
    let bio = null;
    if (this.props.userData) {
      if (
        !this.props.userData.credentials.job &&
        !this.props.userData.credentials.birthDate &&
        !this.props.userData.credentials.location
      ) {
        bio = (
          <h3 style={{ alignSelf: 'center' }}>
            Click on the icon to add your bio
          </h3>
        );
      } else {
        bio = (
          <Fragment>
            {this.props.userData.credentials.location ? (
              <div>
                <h3>Location</h3>
                <h4 className={styles.info}>
                  {this.props.userData.credentials.location}
                </h4>
              </div>
            ) : null}
            {this.props.userData.credentials.job ? (
              <div>
                <h3>Job</h3>
                <h4 className={styles.info}>
                  {this.props.userData.credentials.job}
                </h4>
              </div>
            ) : null}
            {this.props.userData.credentials.birthDate ? (
              <div>
                <h3>Birth Date</h3>
                <h4 className={styles.info}>
                  {this.props.userData.credentials.birthDate}
                </h4>
              </div>
            ) : null}
          </Fragment>
        );
      }
    }
    const profile = this.props.userData ? (
      <div className={styles.profile}>
        <div className={styles.imgContainer}>
          <div className={styles.profileImage}>
            <img src={this.state.image} alt='profile' />
            <h2>@{this.props.userData.credentials.username}</h2>
            <button className={styles.editImage} onClick={this.openFileInput}>
              <i className='fas fa-edit'></i>
            </button>
            <input
              type='file'
              id='edit-pic'
              hidden='hidden'
              onChange={this.onImageChange}
            />
          </div>
        </div>
        <div className={styles.bio}>
          <button className={styles.editBio} onClick={this.openEditForm}>
            <i className='fas fa-edit'></i>
          </button>
          {bio}
        </div>
      </div>
    ) : null;
    return (
      <Fragment>
        {this.state.showEditForm && <EditBio onClick={this.closeEditForm} />}
        {profile}
      </Fragment>
    );
  }
}
const mapStateToProps = ({ user: { userData } }) => ({
  userData,
});
const mapDispatchToProps = (dispatch) => ({
  editProfileImageAction: (formData, history) =>
    dispatch(editProfileImage(formData, history)),
});
export default connect(mapStateToProps, mapDispatchToProps)(profile);
