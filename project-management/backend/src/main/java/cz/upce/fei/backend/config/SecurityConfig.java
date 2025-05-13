// src/main/java/cz/upce/fei/backend/config/SecurityConfig.java
package cz.upce.fei.backend.config;

import cz.upce.fei.backend.jwt.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Žádné cookies / CSRF pro REST
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Konfigurace pravidel
                .authorizeHttpRequests(auth -> auth
                        // 1) veřejné auth endpointy
                        .requestMatchers("/api/auth/**").permitAll()

                        // 2) vlastní profil
                        .requestMatchers(HttpMethod.GET, "/api/users/me").authenticated()

                        // 3) CRUD users pro managera
                        .requestMatchers(HttpMethod.GET,    "/api/users/**").hasRole("manager")
                        .requestMatchers(HttpMethod.POST,   "/api/users").hasRole("manager")
                        .requestMatchers(HttpMethod.PUT,    "/api/users/**").hasRole("manager")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("manager")

                        // 4) projekty
                        .requestMatchers(HttpMethod.POST,   "/api/projects").hasRole("manager")
                        .requestMatchers(HttpMethod.PUT,    "/api/projects/**").hasAnyRole("manager","developer")
                        .requestMatchers(HttpMethod.PATCH,  "/api/projects/*/status").hasAnyRole("manager","developer")
                        .requestMatchers(HttpMethod.GET,    "/api/projects/**")
                        .hasAnyRole("manager","developer","tester")

                        // 5) úkoly
                        .requestMatchers(HttpMethod.POST,   "/api/tasks").hasAnyRole("manager", "developer")
                        .requestMatchers(HttpMethod.PUT,    "/api/tasks/**").hasAnyRole("manager", "developer")
                        .requestMatchers(HttpMethod.GET,    "/api/tasks/**").hasAnyRole("manager", "developer", "tester")
                        .requestMatchers(HttpMethod.PATCH,  "/api/tasks/*/status").hasAnyRole("manager", "developer")  // FIX tady
                      
                        // 6) Týmy
                        .requestMatchers(HttpMethod.GET, "/api/teams").hasRole("manager")
                        .requestMatchers(HttpMethod.GET, "/api/teams/**").hasRole("manager")
                        .requestMatchers(HttpMethod.POST, "/api/teams").hasRole("manager")
                        .requestMatchers(HttpMethod.PATCH, "/api/teams/*/add-member/*").hasRole("manager")
                        .requestMatchers(HttpMethod.PATCH, "/api/teams/*/remove-member/*").hasRole("manager")



                        // 7) všechno ostatní musí být autentizováno
                        .anyRequest().authenticated()
                )

                // Zakážeme UI login
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                // Vložíme JWT filtr před standardní autentizační
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}
