package team.lazecrew.service;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Path("/")
public class WEService {

	private static final Logger LOGGER = LoggerFactory.getLogger(WEService.class);
	
	@POST
	@Path("/load/{version}/{token}/{ids}")
	public Response loadData(
			@PathParam("version") String version,
			@PathParam("token") String token,
			@PathParam("ids") String ids) {
		
		LOGGER.info("Request inc.\n  version: " + version 
				+ "\n  token: " + token 
				+ "\n  ids: " + ids);
		
		
		
		return Response.status(Status.OK).build();
	}
	
}
