const LoginChecker=({children})=>{
    const token=localStorage.getItem('token');
    if(token){
        return children;
    }else{
        window.location.href='Login';
        return null;
    }
}
export default LoginChecker;