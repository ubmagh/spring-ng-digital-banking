package me.ubmagh.ng_spring_digital_banking.security.config;

public class Jwt_config {

    public static String REFRESH_PATH = "/api/refresh-token";
    public static String SECRET_PHRASE = "JackSparro1234567";
    public static String AUTHORIZATION_HEADER = "Authorization";
    public static String TOKEN_HEADER_PREFIX = "Bearer ";
    public static int ACCESS_TOKEN_EXPIRATION = 2*60*1000; // 2mins
    public static int REFRESH_TOKEN_EXPIRATION = 10*60*1000; // 10 mins

}
