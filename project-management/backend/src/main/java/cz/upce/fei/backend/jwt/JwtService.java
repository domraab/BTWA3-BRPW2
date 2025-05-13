package cz.upce.fei.backend.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private SecretKey getSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generuje token pro uživatele včetně jeho role.
     */
    public String generateToken(String username, String role) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + 3_600_000); // 1h

        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)             // <-- tady přidáme roli
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(getSecretKey())
                .compact();
    }

    /**
     * Validuje podpis i expiraci a vrací payload (Claims).
     */
    public Claims validateTokenAndGetClaims(String token) {
        JwtParser parser = Jwts.parser()
                .verifyWith(getSecretKey())
                .build();

        return parser.parseSignedClaims(token).getPayload();
    }

    /** Vrací subject (username). */
    public String getUsernameFromToken(String token) {
        return validateTokenAndGetClaims(token).getSubject();
    }

    /** Vyčte roli z tokenu. */
    public String getRoleFromToken(String token) {
        return validateTokenAndGetClaims(token).get("role", String.class);
    }
}
