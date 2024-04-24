const Notification = ({ message, type }) => {
    if (message === null) {
      return null
    }
  
    const notificationClassName = type === 'success' ? 'notification success' : 'notification error';

    return (
      <div className={notificationClassName}>
        {message}
      </div>
    )
  }

export default Notification