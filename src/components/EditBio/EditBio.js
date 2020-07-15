import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import styles from './EditBio.module.css';
import Backdrop from '../../util/Backdrop/Backdrop';
import { editBio } from '../../redux/actions/dataActions';
class EditBio extends Component {
  state = {
    location: '',
    job: '',
    birthDate: '',
  };
  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onEditBioSubmit = () => {
    let bio = {};
    if (this.state.location.trim().length !== 0)
      bio.location = this.state.location;
    if (this.state.job.trim().length !== 0) bio.job = this.state.job;
    if (this.state.birthDate.trim().length !== 0)
      bio.birthDate = this.state.birthDate;
    this.props.editBioAction(bio);
    this.props.onClick();
  };
  render() {
    return (
      <Fragment>
        <Backdrop onClick={this.props.onClick} />
        <div className={styles.EditBio}>
          <div className={styles.editForm}>
            <h3 style={{ textAlign: 'center' }}>Edit whatever you want</h3>
            <div className={styles.input}>
              <h4>Location</h4>
              <input
                type='text'
                className={styles.editFormInput}
                name='location'
                value={this.state.location}
                onChange={this.onChangeHandler}
              />
            </div>
            <div className={styles.input}>
              <h4>Birthday</h4>
              <input
                type='date'
                name='birthDate'
                className={styles.editFormInput}
                value={this.state.birthDate}
                onChange={this.onChangeHandler}
              />
            </div>
            <div className={styles.input}>
              <h4>Job</h4>

              <input
                type='text'
                className={styles.editFormInput}
                value={this.state.job}
                name='job'
                onChange={this.onChangeHandler}
              />
            </div>
            <button
              className={styles.editFormButton}
              onClick={this.onEditBioSubmit}
            >
              Edit
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}
const mapActionsToProps = (dispatch) => ({
  editBioAction: (bio) => dispatch(editBio(bio)),
});
export default connect(null, mapActionsToProps)(EditBio);
