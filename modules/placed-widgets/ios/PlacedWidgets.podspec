Pod::Spec.new do |s|
  s.name           = 'PlacedWidgets'
  s.version        = '1.0.0'
  s.summary        = 'Reports which of the app\'s widgets the user has placed'
  s.description    = 'Bridges WidgetCenter.getCurrentConfigurations to JS.'
  s.author         = ''
  s.homepage       = 'https://github.com/open-atelier/widgets-atelier-app'
  s.license        = { :type => 'MIT' }
  s.platforms      = { :ios => '17.0' }
  s.source         = { :git => '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES'
  }

  s.source_files = '**/*.{h,m,mm,swift,hpp,cpp}'
end
