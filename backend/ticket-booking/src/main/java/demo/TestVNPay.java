package demo;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.stream.Collectors;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class TestVNPay {

    public static void main(String[] args) {
        String secretKey = "WOX93XWGGLC2YUHTZUOB7ALN5LPG8VRE";
        String tmnCode = "3JZ7QBUX";
        String vnpReturnUrl = "http://localhost:8080/api/payment/vnpay-return";
        String vnpAmount = "70000000"; // from user's image 70 triệu

        SortedMap<String, String> vnp_Params = new TreeMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", tmnCode);
        vnp_Params.put("vnp_Amount", vnpAmount);
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_BankCode", "NCB");
        vnp_Params.put("vnp_TxnRef", "3d57c867a4d5"); // from user's image
        vnp_Params.put("vnp_OrderInfo", "Thanh toan booking %235"); // Note: the user's orderInfo had %20 and %23
        vnp_Params.put("vnp_OrderType", "billpayment");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnpReturnUrl);
        vnp_Params.put("vnp_IpAddr", "0:0:0:0:0:0:0:1");
        vnp_Params.put("vnp_CreateDate", "20260309104325"); // from user's image

        String queryUrl = com.booking.api.util.VNPayUtil.buildQueryString(vnp_Params);
        String vnp_SecureHash = com.booking.api.util.VNPayUtil.hmacSHA512(secretKey, queryUrl);

        System.out.println("Query URL (Hash Data): " + queryUrl);
        System.out.println("Secure Hash Generated: " + vnp_SecureHash);
        System.out.println(
                "Expected Secure Hash from user image: ed91fab2693e5a397e4463ac2406cc3611ddb5b3364ced3bc3b008a9e3b7f3e6f2654f3ea712fd3a3dbc65ca1e9849ce7318f0e9796cc6007bae302aa7d48c46");
    }

    public static String buildQueryString(SortedMap<String, String> params) {
        return params.entrySet().stream()
                .filter(e -> e.getValue() != null && !e.getValue().isEmpty())
                .map(e -> {
                    try {
                        String key = URLEncoder.encode(e.getKey(), StandardCharsets.US_ASCII.toString());
                        String value = URLEncoder.encode(e.getValue(), StandardCharsets.US_ASCII.toString());
                        return key + "=" + value;
                    } catch (Exception ex) {
                        return "";
                    }
                })
                .collect(Collectors.joining("&"));
    }

    public static String hmacSHA512(String key, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac.init(secretKeySpec);
            byte[] hash = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            return null;
        }
    }
}
