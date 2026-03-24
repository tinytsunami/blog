---
title: NSPA 封包檢測速記
permalink: nspa-fast-note/
categories: (legacy) other
date: 2020-08-05
mathjax: false
---

這篇是之前跑去考 NSPA 證照的筆記。

{% note success %}
原為筆者 Evernote 的私人筆記，重新排版後公開。（初版：2016-03-14）
{% endnote %}

<!-- more -->

# 封包列表檢測原則

## 時間斷點（Time Gap）
1. 兩個封包時間間隔大於一秒，精確到小數點第二位。
2. 存在時間斷點，即使同個會話（Seesion）也代表沒有持續傳送。
3. 斷點有不定間距，代表造成原因是人為的，反之。
4. 斷點有固定間距，先判斷是否為攻擊，如果是，則為APT攻擊完後的殘留，或是使用軟體暴力破解密碼。
5. 斷點在命令與命令中間，代表是使用者延遲（User Delay）應注意。
6. 斷點在命令與回應中間，代表是伺服器忙碌（Server Buzy）代表不是資訊安全問題。

## IP位置
1. 本機位置（Local host）：127.0.0.1
2. LAN（區域網路）DHCP第一個定址封包：0.0.0.0
   192.168.XXX.XXX
   10.10.XXX.XXX
   172.16X-18X.XXX.XXX
3. 其他幾乎都是網際網路（WAN）的封包位置。

## 通訊協定
1. 常見的有TCP、UDP、ICMP、ARP等。
2. 通訊協定中，僅有TCP具法律意義。
3. TCP具有特殊的三向交握（3-way hand shanking）特性。
4. TCP具有時間戳記，封包錯置時可以修正。
5. TCP在封包遺失時，會重新傳送。
6. 由於TCP具三向交握特性，一旦經過網際網路（Internet WAN）則具不可否認性，可以作為法庭證據。

## 通訊埠（Port）
1. 封包傳送紀錄中，通常通訊埠（Port）小於1024者，為伺服端（Server）；反之。
2. 若攻擊事件發生，則伺服端（Server）必為被駭主機，攻擊者為對向客戶端（Client）IP位置。
3. TCP通訊協定中，傳送、接收雙方的通訊埠同時小於1024的情況幾乎不存在；而兩端同時大於1024，則尋找已知的通訊埠編號，其通常為伺服端。

## 傳送資料
1. 通常只分析明碼（Plain Text），是指有意義的英文字詞。
2. 亂碼（Mess Text）不分析，其可能是媒體資料（圖片、音樂）、或是特殊格式的壓縮檔、加密檔。
3. 如果傳送資料，一段時間都沒有內容（空資料），則代表有問題。
4. 如果同時具有明碼、亂碼，則稱作亂碼1/2，代表的是亞洲語言碼，是亞洲地區特殊狀況。
5. 走80通訊埠，結果不符合HTTP格式，代表有問題。
6. 若任何指令後，跟隨大量單一文字並在最後加入跳轉指令（Shell Code），則為緩存溢位攻擊（Buffer Overflow）。

# 通訊協定 HTTP

## 基本資訊
1. 預設通訊埠：80 Port。
2. 如果在伺服端（Server）錄封包，則會得到一個封包。
3. 如果在客戶端（Client）錄封包，則會得到二個封包，其中一個是DNS封包。
4. 如果客戶端（Client）使用跳板（Proxy），則IP位置不同。
5. 如果客戶端（Client）使用防火牆（Firewall），則IP位置相同（除非有NAT技術）。
6. 通常HTTP協定不進行伺服器端對客戶端的先行封包通知。

## 指令集
1. 瀏覽器命令（Browser Command）：GET、POST。
   GET與POST的差異，僅差在資料在封包中的位置。會回傳網站內容。客戶端GET命令之後，接著http://字串，代表有Proxy。
2. 測試命令（Test Command）：HEAD、OPTIONS、TRACE。
   當初設計給網管使用，但現在多被駭客做為漏洞掃描的工具。測試命令是法律的灰色地帶，不足以定罪。都不會回傳網站內容。HEAD命令詢問網站存在與否。OPTIONS命令詢問存取權限。TRACE命令詢問服務的狀態。
3. 駭客命令（Hack Command）：PUT、DELETE以及其他命令。
   屬於Web DEV指令集。

## Web DEV指令集
1. 設計來給網管的指令集，如PUT、DELETE、MOVE、PUT等。
2. 常被駭客用來作為攻擊工具。
3. 預設值通常是關閉。

## 常見狀態碼
1. 2XX代表網站存在。
   206代表連續傳送，多用於媒體串流。
2. 3XX代表網站不存在。
   301代表主機維護中，站點已遷移。302代表位置轉向，常用於分流。304代表網站內容沒有修改，要求客戶端使用快取資料（代表有重複請求）。
3. 4XX代表客戶端錯誤。
   400代表指令格式錯誤。401代表僅允許特定IP存取，通常是指未經授權。403代表所有人都不能存取。404代表資料不在。
4. 5XX代表伺服端錯誤。
   500網站有BUG，或是代表資料注入攻擊（SQL Injection）。發生500時，向下搜尋可以找到許多500錯誤，代表這是網站BUG。
   發生500時，向上搜尋對向封包，
   若資料找到「'」、「"」、「;」以及「,」四個符號，代表是資料注入攻擊（SQL Injection）。

## 封包內容
1. 無參考來源（Referer）：可能被設為首頁、書籤或是直接輸入網址。
2. 無主機名稱（Host）、或有主機名稱但為IP位址時，應提高警覺。
3. 無前端瀏覽器名稱（User-Agent）或是無法辨識的名稱，應提高警覺。
4. 若出現UPnP字樣，則代表是UPnP協定（用於無線基地台），則指令集可以與HTTP不同。

# 通訊協定SMTP

## 基本資訊
1. 預設通訊埠：25 Port。
2. SMTP用於郵件寄信。
3. SMTP伺服器可以被稱作MTA（Mail Transfer Agent）。
4. 寄件人相當容易偽造，故無法成為法律依據。
5. 法律依據通常是軟體配予唯一的Message-ID（Client）、以及伺服器給予的信件ID（Server ID）。

## 指令集
1. 伺服器應答命令：HELO、EHLO。
   HELO：一般使用。EHLO：除了回答，同時也回覆擴充指令。此類命令提供客戶端兩個訊息：版本、身份確認。通常由伺服器端先通知客戶端。
2. 一般使用命令：RCPT TO、MAIL FROM、DATA、QUIT。
   RCPT TO：收件人地址。MAIL FROM：寄件人地址。DATA：資料。QUIT：斷開連線。
3. 認證指令（擴充）：AUTH、PASS。
   AUTH：帳號。PASS：密碼。由於一般寄件不需要帳密，故屬擴充命令。設計時採用Base64編碼（編碼不是加密）。
4. 網管命令：VRFY、EXPN。
   VRFY：詢問使用者清單。EXPN：詢問郵件清單。此類命令常被駭客確認帳戶的存在與否。常被漏洞掃描程式當成真的漏洞。

## 常見狀態碼
1. 1XX：初始化狀態，是少見的代碼。
2. 2XX：指令成功。
   220伺服器應答。250指令成功。
3. 3XX：佇列狀態、指令暫存且未執行。
   354開始郵件輸入。
4. 4XX：暫時拒絕。
5. 5XX：正式拒絕請求。
   502不支援該指令。550不執行該指令。

# 通訊協定POP3

## 基本資訊
1. 預設通訊埠：110 Port。
2. POP3用於郵件收信。
3. POP3是POP通訊協定系列的第三版。
4. POP3需要確認帳號密碼。
5. POP3是少數命令大小寫通用的協定。

## 指令集
1. 登入、出命令：USER、PASS、QUIT。
   USER：傳送帳號。PASS：傳送密碼。QUIT：離開、登出。
2.  管理命令：STAT、LIST。
   STAT：詢問信件數量。LIST：詢問信件列表。
3.  收信命令：RETR、DELE。
   RETR：收信（請求信件內容）。DELE：刪除信件。

## 常見狀態碼
1. 符號+：允許、核准。
2. 符號-：不允許、不核准。

# 通訊協定IMAP

## 基本資訊
1. 預設通訊埠：143 Port。
2. POP3的改良版。
3. 支援多客戶連線、目錄夾層管理以及閱讀標記。

## 指令集
1. CAPABILITY：詢問支援的命令。
2. LOGIN：登入（帳號、密碼）
3. SELECT：切換目錄。
4. LIST：列表、或條件（過濾）列表。
5. FETCH：收信。
6. STARTTLS：採用SSL加密。
7. LOGOUT：登出。
8. NOOP：不做任何事。

## 常見狀態碼
1. 符號*後接字串，沒有特別的狀態碼。
2. 為因應多人連線，命令時會回傳命令編號。

# 通訊協定ICMP

## 基本資訊
1. 預設通訊埠：Null Port。
2. ICMP是網路診斷的通訊協定。
3. 常常沒有顯示Port，也有可能出現0 Port。
4. 傳出去的資料，若網路有通，則會以原本的樣子回傳。
5. Windows OS中Win7以前的版本（不含）是以abcdefghi...作為Ping的資料。
6. Windows OS中Win7以後的版本（含）是以ABCDEFGHI...作為Ping的資料。

# 通訊協定CIFS/SMB

## 基本資訊
1. CIFS是微軟推廣的、SMB是IBM提出的。
2. 即網路芳鄰。
3. 預設通訊埠TCP：139、445 Port。
   預設通訊埠UDP：135、136、137、138 Port。
   微軟宣稱版本Windows 7（含）以前，使用139 Port；
    而Windows 7（不含）後則採用445 Port，且445 Port是加密的資料。
   實際情況是，Windows 7（含）以前，使用139 Port；
    而Windows 7（不含）後則兩者皆採用，且445 Port預設沒有加密。
4. 基本上，以下四個用途皆無的情況，應關閉此功能。
   登入、出AD Server。
   區域網路送訊息。目錄分享。列印印支援（點陣列印）。

## 常見狀態碼
1. SMBr：準備登入。
2. SMBs：回覆登錄訊息。
3. 代表登入失敗的訊息
   SMBsm：登入失敗。SMBt：伺服器請求中斷。
4. 代表登入成功的訊息
   SMBu：發送授權。SMB%：發送資料。

## 攻擊判斷
1. 網路芳鄰的UDP，雙方的Port必須匹配。
    如果沒有匹配，則代表客戶端不是Windows OS；
    但如果確定是Windows OS，則代表此電腦中毒或異常。
2. 網路芳鄰的TCP/UDP雙方的IP，如果其中一方是WAN IP則代表中毒或異常。
3. SMBr、SMBs之後出現多次（3次以上）SMBsm、SMBt，則代表對方嘗試用多組密碼入侵。

# 通訊協定MMS

## 基本資訊
1. 預設80、554 Port。
2. 繞過Proxy，可以抓到真的IP。

# 資料庫與SQL

## 基本資訊
1. MS-SQL預設通訊埠：TCP-1433 Port、UDP-1434 Port。
2. MySQL預設通訊埠：TCP-3306 Port（有可能改變）。
3. Oracle SQL預設通訊埠：TCP-1520、1521…… Port。
4. IBM-DB2預設通訊埠：TCP-50000 Port（有可能改變）。
5. Sybase預設通訊埠：TCP-5000 Port（有可能改變）。

## 基本指令
1. 資料定義語言（Data Definition Language, DDL）：CREATE、ALTER、DROP。
   IIS、Apache的Log中出現，代表異常。SQL的Log中出現，代表異常。
2. 資料操縱語言（Data Manipulation Language, DML）：SELECT、INSERT（單筆）、UPDATE、DELETE。
   IIS、Apache的Log代表異常。SQL的Log中出現，代表正常。
3. 資料控制語言 (Data Control Language, DCL)：GRANT、REVOKE、COMMIT、ROLLBACK。
   COMMIT、ROLLBACK在SQL的Log中是正常的、而出現在IIS、Apache的Log中，則代表異常。
   GRANT、REVOKE在SQL的Log、IIS、Apache的Log中，則代表異常。
4. 擴充指令：sp_xxx…（Stroe Procedure）、xp_xxx…（Extention Procedure）。
   Stroe Procedure中有文字檔、SQL指令。Extention Procedure中有可執行檔（.exe、.dll）、CPU指令。xp_cmdshell相當於命令提示字元，只存在於MS-SQL中。sp_cursoropen可用於頁籤的資料流量減少。

# 其他

## 常見操作指令
1. netstat -ano（用於尋找應用程式的PID）。
2. tasklist（確認應用程式）。
3. nc ip port（連接到伺服器）。
4. net user username/password（創建一個使用者）。

## 封包錄製的原則
1. 伺服器端的原則是忽略。
   忽略該伺服器的工作（Web Server忽略80、443 Port等）。
2. 客戶端的原則是時段。區域網路內流通的封包不檢查。
   開機、上班時段：
   DNS封包。80 Port以外的封包。
   半夜、維修時段：
   作業系統更新封包。防毒系統更新封包。
3. 同時有伺服器端、客戶端時，應進行時間校準。

## 其他補充
1. 流量資訊前幾名透漏資管問題，後幾名透漏資安問題。
2. 有種壓縮叫做Run Length（RLE），也是BMP的使用算法。特性是相當簡單、直觀。
3. 前端瀏覽器名稱（User-Agent）為NSPlayer，代表是iPhone等Apple系列i字頭產品，
    來源是賈伯斯離開Apple後，創立的另一間公司NextStep的API。
4. TermService 是 3389 port（WTS/RDP）。
5. 遭入侵後，應看Event Log尋找問題軟體（Application）經由Dr.Watson取得入侵時間，再由時間尋找Securtiy。
6. 通常犯罪後，刪除Event Log的事件，都是台灣人做的。
7. 日本與德國研究的離散積分，是為了計算網路流量，其是根據IBM在2002年提出的網路流量用一階離散微分（即差分）。
8. 錄製Wi-Fi封包需要特殊裝置（如：AirPcap™ 802.11 Packet Capture）。
9. 錄製3、4G封包需要特殊裝置。
10. 漏洞資料網站：https://www.exploit-db.com/、https://www.cvedetails.com/。
11. 加密Encrypt-ion、解密Decrypt-ion。
12. 常見的封包讀取英文：READ、GET、RETRIEVE、RECEIVE、FETCH。
13. 美國NASA使用許多老舊的系統、通訊協定，原因是70年前的人造衛星在太空難以更新。
14. Windows 95有許許多多的客群，多半是運作得當、但更新困難的獨立系統，比如：航海雷達。
15. 維持老舊系統中，由於硬體時脈的關係，常需要讓CPU變慢的程式，全世界約有三家公司專門製作，其中美國就有兩家。
16. 錄製封包，在OSI模型的第二層，將不會錄到MAC位置。
17. 筆電應該關閉無線網路的網路芳鄰。
    將網路介面卡的Client of Microsoft Networks打勾取消。將網路介面卡的File and Printer Sharing Microsoft Networks打勾取消。將TCP/IPv4進階中WINS頁籤的NetBIOS over TCP/IP停用。
18. 妨礙名譽可以是事實、偽造內容；而毀謗成立要是偽造訊息。大小寫英文、數字組合的內容，通常為Base64編碼（或MIME）。
    毀謗罪，以圖片、文字或影片表達，加重50%刑責。
19. 大多數通訊協定的指令需大寫。
20. 若攻擊者的Port在攻擊時的封包呈現單位漸增，代表是針對性攻擊；
     反之，如果是跳躍性漸增，則是攻擊一整個網段，也可以從跳躍的數量判斷遭攻擊的電腦數量。
21. APT攻擊的痕跡，呈現固定的時間斷點、並不斷地送出空封包。
22. 情資蒐索有兩個重點：精確性、隱匿性。
     中國、沒經驗的情資蒐索，常一次大量、快速的掃描Port。
     而韓國的掃描為了隱匿，大約30秒才送一個封包，這個做法的專業術語叫做「慢速掃描」。
23. 早期UNIX的一個漏洞是0 Port漏洞，當接收到0 Port將當機。
24. Web漏洞大致上有兩種：SQL-Injection資料庫注入攻擊、Cross Site Script(XSS)跨站腳本攻擊。
    SQL-Injection：HTTP（夾雜SQL）攻擊WebSite後的Database。
    Cross Site Script(XSS)：HTTP（夾雜JS）攻擊WebSite的Client。
25. Domino是冷門的Web Server。
26. Content Management System（CMS）內容管理系統。
27. Packet Storm Security：專門報導資訊安全的新聞網站。
28. Native library（原生Lib）、ODBC（異植資料庫）。
29. 封包Payload中，存在符號「.」這是微軟創造的Unicode（2Bytes）的關係，英文多出的1Bytes用此符號代替。
    存在3Bytes的Unicode用於阿拉伯文的文字方向控制。
30. 一個MAC有多個IP看這個是否為閘道、防火牆，屬正常現象；但不是則異常。
