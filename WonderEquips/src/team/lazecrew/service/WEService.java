package team.lazecrew.service;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import team.lazecrew.service.connector.MySQLConnector;

@Path("/")
public class WEService {

	private static final Logger LOGGER = LoggerFactory.getLogger(WEService.class);
	
	@POST
	@Path("/load/{version}/{token}/{ids}")
	public Response loadData(
			@PathParam("version") String version,
			@PathParam("token") String token,
			@PathParam("ids") String ids) {
		
		LOGGER.info("Request inc. version:'" + version + "' token: '" + token + "' ids: '" + ids + "'");
		
		String[] idsArr = ids.split(",");
		if (idsArr.length == 1 && idsArr[0].trim().length() <= 0) {
			LOGGER.debug("Empty data. Truncated.");
		} else if (idsArr.length == 1) {
			MySQLConnector.insertData(version, token, idsArr[0]);
		} else {
			MySQLConnector.insertData(version, token, idsArr);
		}
		
		return Response.status(Status.OK).build();
	}
	
	public static void main(String[] args) {
		MySQLConnector.insertData("1.2", "duptest", new String[]{"7","8"});
	}
	
}
