package team.lazecrew.service.util;

import java.sql.Connection;
import java.sql.DriverManager;

public class ConnectionUtil {

	private static final String DB_ADDR = "localhost";
	private static final String DB_PORT = "3306";
	private static final String DB_SCHM = "we";
	private static final String DB_ID = "root";
	private static final String DB_PW = "kitchu0401";
	
	private static Connection connection;
	
	private ConnectionUtil() { /* block */ }
	
	public static Connection getConnection() throws Exception {
		if (connection == null) {
			// create new connection
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			connection = DriverManager.getConnection(String.format(
					"jdbc:mysql://%s:%s/%s?user=%s&password=%s", 
					DB_ADDR, DB_PORT, DB_SCHM, DB_ID, DB_PW));
		}
		
		return connection;
	}
	
}
