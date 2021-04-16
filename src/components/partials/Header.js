import { login, logout } from "../../services/firebase";

const Header = (props) => (
  <header>
    <h1>Know Yourself</h1>
    <ul>
      {props.user ? (
        <>
        <li>
            {" "}
            <div className="dropdown">
              <button className="dropbtn">
                <i className="fa fa-caret-down"></i>
              </button>
              <div className="dropdown-content">
                <a href="https://www.google.com/">My Diary</a>
                <a href="#">My Calendar</a>
                <a href="#">Habit Tracker</a>
                <a href="#">Habit Tracker</a>
                <a href="#">Habit Tracker</a>
                <a href="#" onClick={logout}>
                  Logout{" "}
                </a>
              </div>
            </div>
          </li>
          <li>Welcome, {props.user.displayName}</li>
          <li>
            <img src={props.user.photoURL} alt={props.user.displayName} />
          </li>
          
        </>
      ) : (
        <li onClick={login}>Login</li>
      )}
    </ul>
  </header>
);

export default Header;
