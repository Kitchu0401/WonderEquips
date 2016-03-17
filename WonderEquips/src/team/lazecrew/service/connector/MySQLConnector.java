package team.lazecrew.service.connector;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mysql.jdbc.exceptions.jdbc4.MySQLIntegrityConstraintViolationException;

public class MySQLConnector {

	private static final Logger LOGGER = LoggerFactory.getLogger(MySQLConnector.class);
	
	private static final String DB_ADDR = "apdoer.ciszfmxklhbp.ap-northeast-2.rds.amazonaws.com";
	private static final String DB_PORT = "3306";
	private static final String DB_SCHM = "we";
	private static final String DB_ID = "apdoer";
	private static final String DB_PW = "apdoer1234";
	
	// queries
	private static final String QUERY_INSERT_ACCESS_LOG = " INSERT INTO log_access VALUES (?, ?, now()) ";
	private static final String QUERY_INSERT_DATA = " INSERT IGNORE INTO watchids VALUES (?, ?, ?) ";
	
	private static Connection connection;
	
	private MySQLConnector() { /* block */ }
	
	private static Connection getConnection() throws Exception {
		if (connection == null) {
			// create new connection
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			connection = DriverManager.getConnection(String.format(
					"jdbc:mysql://%s:%s/%s?user=%s&password=%s", 
					DB_ADDR, DB_PORT, DB_SCHM, DB_ID, DB_PW));
		}
		
		return connection;
	}
	
	public static int insertAccessLog(String version, String token) {
		Connection connection = null;
		PreparedStatement pstmt = null;
		
		int resultCount = 0;
		
		try {
			connection = getConnection();
			pstmt = connection.prepareStatement(QUERY_INSERT_ACCESS_LOG);
			pstmt.setString(1, version);
			pstmt.setString(2, token);
			resultCount = pstmt.executeUpdate();
			
			LOGGER.info(String.format("Row inserted: [%s][%s]", version, token));
		} catch (Exception e) {
			LOGGER.error("An error occured in processing DB task :");
			e.printStackTrace();
		}
		
		return resultCount;
	}
	
	public static int insertData(String version, String token, String id) {
		Connection connection = null;
		PreparedStatement pstmt = null;
		
		int resultCount = 0;
		
		try {
			connection = getConnection();
			pstmt = connection.prepareStatement(QUERY_INSERT_DATA);
			pstmt.setString(1, version);
			pstmt.setString(2, token);
			pstmt.setInt(3, Integer.parseInt(id));
			resultCount = pstmt.executeUpdate();
			
			LOGGER.info(String.format("Row inserted: [%s][%s][%s]", version, token, id));
		} catch (MySQLIntegrityConstraintViolationException dupKeyEx) { 
			LOGGER.debug(String.format("Data Already exists: [%s][%s][%s]", version, token, id));
		} catch (Exception e) {
			LOGGER.error("An error occured in processing DB task :");
			e.printStackTrace();
		}
		
		return resultCount;
	}
	
	public static int insertData(String version, String token, String[] ids) {
		Connection connection = null;
		PreparedStatement pstmt = null;
		
		int[] resultCountArr = null;
		
		try {
			connection = getConnection();
			pstmt = connection.prepareStatement(QUERY_INSERT_DATA);
			
			for (String id : ids) {
				pstmt.setString(1, version);
				pstmt.setString(2, token);
				pstmt.setInt(3, Integer.parseInt(id));
				pstmt.addBatch();
				
				LOGGER.info(String.format("Batch added: [%s][%s][%s]", version, token, id));
			}
			
			resultCountArr = pstmt.executeBatch();
		} catch (Exception e) {
			LOGGER.error("An error occured in processing DB task :");
			e.printStackTrace();
		}
		
		int resultCount = 0;
		if (resultCountArr != null) {
			for (int count : resultCountArr) {
				resultCount += count;
			}
		}
		
		LOGGER.info(String.format("Batch completed: %d rows inserted of %d rows", ids.length, resultCount));
		return resultCount;
	}
	
}
