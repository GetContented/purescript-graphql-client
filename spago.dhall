{-
Welcome to a Spago project!
You can edit this file as you like.
-}
{ name = "my-project"
, dependencies =
  [ "aff"
  , "affjax"
  , "argonaut-codecs"
  , "argonaut-core"
  , "console"
  , "effect"
  , "foreign-generic"
  , "foreign-object"
  , "graphql-parser"
  , "heterogeneous"
  , "parsing"
  , "psci-support"
  , "record"
  , "spec"
  , "strings-extra"
  , "typelevel"
  , "variant"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
