package team.lazecrew.parser;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.Iterator;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

@SuppressWarnings("unchecked")
public class ParserMain {

	static final String FILE_PATH = "team/lazecrew/parser/source/WonderTactics.html";
	
	public static void main(String[] args) throws Exception {
		
		String file = getFileFromResource(FILE_PATH);
		
		JSONArray results = new JSONArray();
		
		Document doc = Jsoup.parse(file, "UTF-8");
		Elements rows = doc.select("tr");
		Iterator<Element> iter = rows.iterator();
		
		iter.next();
		
		int id = 0;
		while (iter.hasNext()) {
			JSONObject champ = new JSONObject();
			
			Element e = iter.next();
			
//			이름 
//			등급 
//			속성 
//			유형 
//			특성무 
//			무기1 무기2 무기3 무기4 무기5 
//			방어구1 방어구2 방어구3 방어구4 방어구5 
//			악세1 악세2 악세3 악세4 악세5
			
			champ.put("id", id++);
			champ.put("name", "'" + e.child(0).html() + "'");
			champ.put("grade", Integer.parseInt(e.child(1).html()));
			champ.put("element", getElementIndex(e.child(2).html()));
			champ.put("type", getTypeIndex(e.child(3).html()));
			champ.put("skill", getSkillArray(e));
			
			results.add(champ);
		}
		
		System.out.println(results.toString().replaceAll("\"", ""));
	}
	
	private static int getElementIndex(String value) throws Exception {
		switch (value) {
		case "불": return 0;
		case "물": return 1;
		case "나무": return 2;
		case "빛": return 3;
		case "어둠": return 4;
		default:
			throw new Exception("Invalid parameter in getting ELEMENT index." + value);
		}
	}
	
	private static int getTypeIndex(String value) throws Exception {
		switch (value) {
		case "공격형":	return 0;
		case "방어형":	return 1;
		case "지원형":	return 2;
		default:
			throw new Exception("Invalid parameter in getting TYPE index: " + value);
		}
	}
	
	private static JSONArray getSkillArray(Element e) throws Exception {
		JSONArray skill = new JSONArray();
		
		int emptySkillIndex = -1;
		String value = e.child(4).html(); 
		switch (value) { // 4
		case "무기":		emptySkillIndex = 0;	break;
		case "방어구":	emptySkillIndex = 1;	break;
		case "악세서리":	emptySkillIndex = 2;	break;
		case "":		emptySkillIndex = -1;	break;
		default:
			throw new Exception("Invalid parameter in getting SKILL array." + value);
		}
		
		int[] s = null;
		for (int i = 0; i < 3; i++) {
			if (i == emptySkillIndex) {
				skill.add(null);
				continue; 
			}
			
			// 원, 마름모, 사각형, 세모, 하트
			s = new int[5];
			for (int j = 0; j < s.length; j++) {
				// 5, 6, 7, 8, 9
				// 10, 11, 12, 13, 14
				// 15, 16, 17, 18, 19
				s[j] = Integer.parseInt(e.child((i + 1) * 5 + j).html());
			}
			skill.add(Arrays.toString(s));
		}
		
		return skill;
	}
	
	private static String getFileFromResource(String path) throws Exception {
		InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream(FILE_PATH);
		BufferedReader in = new BufferedReader(new InputStreamReader(is));
		
		StringBuffer sb = new StringBuffer();
		String line;
		while ((line = in.readLine()) != null) {
			sb.append(line);
		}
		
		return sb.toString();
	}
	
}
