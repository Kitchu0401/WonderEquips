package team.lazecrew.service;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import team.lazecrew.connector.MySQLConnector;

@Path("/")
public class WEService {

	private static final Logger LOGGER = LoggerFactory.getLogger(WEService.class);
	
	private static final String TYPE_LOG_ACCESS = "access";
	private static final String TYPE_LOG_SEARCH = "search";
	
	@POST
	@Path("/log/{type}/{version}/{token}")
	public Response log(
			@PathParam("type") String type,
			@PathParam("version") String version,
			@PathParam("token") String token) {
		
		LOGGER.info(String.format("Page access inc. version:'%s' token: '%s'", version, token));
		
		switch (type) {
		case TYPE_LOG_ACCESS:	MySQLConnector.insertAccessLog(version, token); break;
		case TYPE_LOG_SEARCH:	MySQLConnector.insertSearchLog(version, token); break;
		default:
			LOGGER.warn(String.format("Unrecognized type param: ", type));
			break;
		}
		
		return Response.status(Status.OK).build();
	}
	
	@POST
	@Path("/savePreset/{version}/{token}/{ids}")
	public Response savePreset(
			@PathParam("version") String version,
			@PathParam("token") String token,
			@PathParam("ids") String ids) {
		
		LOGGER.info(String.format(
				"Request inc. version:'%s' token: '%s' ids: '%s'",
				version, token, ids));
		
		String[] idsArr = ids.split(",");
		if (idsArr.length == 1 && idsArr[0].trim().length() <= 0) {
			LOGGER.debug("Empty data. Truncated.");
		} else if (idsArr.length == 1) {
			MySQLConnector.insertPresetData(version, token, idsArr[0]);
		} else {
			MySQLConnector.insertPresetData(version, token, idsArr);
		}
		
		LOGGER.info("  -- successfully loaded.");
		return Response.status(Status.OK).build();
	}
	
	@POST
	@Path("/message/{version}/{token}/{message}")
	public Response message(
			@PathParam("version") String version,
			@PathParam("token") String token,
			@PathParam("message") String message) {
		
		LOGGER.info(String.format(
				"Request inc. version:'%s' token: '%s' message: '%s'",
				version, token, message));
		
		MySQLConnector.insertMessage(version, token, message);
		
		LOGGER.info("  -- successfully messaged.");
		return Response.status(Status.OK).build();
	}
	
}
