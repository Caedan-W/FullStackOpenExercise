对于服务器端会话方案,即使令牌本身只是一个随机字符串,用户身份的验证过程如下:

1. 客户端在登录时,服务器会生成一个随机字符串作为该会话的令牌(session token)。
2. 服务器将令牌与用户信息(如用户ID、权限等)一并存储在服务器端的会话存储中,通常使用内存数据库(如Redis)或关系数据库。
3. 客户端将该令牌保存下来,在后续的每个请求中都会将令牌传递给服务器,通常通过cookie或请求头的方式。
4. 服务器接收到带有令牌的请求后,会到会话存储中查找该令牌对应的会话数据。
5. 如果令牌有效且对应的会话数据存在,服务器就能从中获取到用户身份信息,从而验证和识别发出该请求的用户身份。
6. 根据用户身份,服务器确定其权限,并对请求做出正确的响应处理。

总的来说,随机令牌只是一个能让服务器查找对应会话数据的凭证,真正的用户身份数据是存储在服务器端的,服务器通过令牌查找到会话数据从而验证用户身份。这比在令牌中直接存储用户信息更加安全可靠。

Since the token in a server-side session approach is typically just a random string, the user identity verification process works as follows:

1. When the client logs in, the server generates a random string as the session token for that session.

2. The server stores the token along with the user's information (such as user ID, permissions, etc.) in the server-side session storage, typically using an in-memory data store like Redis or a relational database.

3. The client saves the token and includes it in subsequent requests to the server, usually via cookies or request headers.

4. When the server receives a request with the token, it looks up the corresponding session data in the session storage using the token.

5. If the token is valid and the associated session data exists, the server can retrieve the user's identity information from it, thereby authenticating and identifying the user who made the request.

6. Based on the user's identity, the server determines their permissions and processes the request accordingly.

In summary, the random token is merely a credential that allows the server to look up the corresponding session data; the actual user identity data is stored on the server-side. The server authenticates the user's identity by using the token to find the associated session data, which is more secure than storing the user's information directly in the token itself.