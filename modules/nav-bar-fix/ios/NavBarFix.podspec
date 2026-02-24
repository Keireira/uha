Pod::Spec.new do |s|
  s.name           = 'NavBarFix'
  s.version        = '1.0.0'
  s.summary        = 'Removes glass capsule backgrounds from UIBarButtonItems in sheet navigation bars'
  s.description    = 'Patches UINavigationBarAppearance.buttonAppearance to remove the default capsule background that iOS applies to bar button items in formSheet presentations'
  s.author         = 'Alena Dzhukich'
  s.homepage       = 'https://github.com/Keireira/uha/tree/master/modules/nav-bar-fix'
  s.platforms      = {
    :ios => '15.1',
    :tvos => '15.1'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
