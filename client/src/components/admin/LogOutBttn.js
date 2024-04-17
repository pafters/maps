import './logOutBttn.css';

export default function LogOutBttn({ updAuthToken, shadowOpacity, navBttnColor }) {

    function logOut() {
        localStorage.removeItem('maps-auth-token');
        updAuthToken(null);
        window.location.reload();
    }
    return (
        <button className='log-out-bttn'
            style={{
                textShadow: `0px 0px 1dvw rgba(73, 73, 73, ${shadowOpacity}`,
                color: navBttnColor,
                borderColor: navBttnColor
            }}
            onClick={logOut}>Выйти</button>
    )
}