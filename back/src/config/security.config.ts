
export const SECURITY_CONFIG={
    get PORT(){
        return process.env.PORT!
    }
get JWT(){
    return{
        SECRET:process.env.JWT_SECRET!,
        REFRESH_SECRET:process.env.REFRESH_SECRET!,
    }
}
}
export function ValidateSecurityConfig():void{
   const errors:string[]=[];
    if(!SECURITY_CONFIG.JWT.SECRET||!SECURITY_CONFIG.JWT.REFRESH_SECRET){
       errors.push("JWT_SECRET and REFRESH_SECRET must be defined in the environment variables.");
    }

    if (SECURITY_CONFIG.JWT.SECRET && SECURITY_CONFIG.JWT.SECRET.length < 32) {
        errors.push('JWT_SECRET should be at least 32 characters long');
    }
     if (errors.length > 0) {
        console.error(' Security configuration errors:');
        errors.forEach(err => console.error(`  - ${err}`));
        throw new Error('Invalid security configuration. Please check environment variables.');
    }

    console.log('✓ Security configuration validated');
}