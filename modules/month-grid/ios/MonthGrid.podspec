Pod::Spec.new do |s|
  s.name           = 'MonthGrid'
  s.version        = '1.0.0'
  s.summary        = 'Native SwiftUI month grid for calendar year view'
  s.description    = 'Renders a month calendar grid natively via SwiftUI'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '17.0'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
