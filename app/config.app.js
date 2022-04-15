angular.module("myApp.config", [])
.constant("EnvironmentConfig", {"name":"SIP2DD","title":"SIP2DD","copyright":"","api":"https://kelola.p2dd.go.id/p2dd/api/","logo":"assets/images/SIP2DD.png","favicon":"assets/images/favicon/favicon.png","faviconType":"image/png","loginBackground":"mb-bg-fb-24","showDashboardImage":true,"showRegisterPemohon":true,
"ssoOssApi":"http://webform.oss.go.id/sso/engine/broker/apiSSO?command=login&sso_broker_id=SSO_SICANTIK_010&sso_broker_secret=8izwiL9trwF",
"rest":"https://kelola.p2dd.go.id/p2dd/rest/"})
.constant("ElementConfig", {"gridRow":"15","dialogGridRow":"10","showGridNo":true})
.constant("AppConfig", {"version":"1"});
