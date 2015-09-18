#-- encoding: UTF-8
#-- copyright
# OpenProject is a project management system.
# Copyright (C) 2012-2015 the OpenProject Foundation (OPF)
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License version 3.
#
# OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
# Copyright (C) 2006-2013 Jean-Philippe Lang
# Copyright (C) 2010-2013 the ChiliProject Team
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
#
# See doc/COPYRIGHT.rdoc for more details.
#++

require 'pathname'

def scan_repositories(path)
  repositories = Pathname.new(path).children.select(&:directory?)
  missing = []

  repositories.each do |repo|
    # Repository may be suffixed by '.git' and the like
    identifier = repo.basename.to_s.split('.')[0]
    missing << identifier if Project.find_by(identifier: identifier).nil?
  end

  missing
end

namespace :scm do
  desc 'List repositories in the current managed path that do not have an associated project'
  task find_unassociated: :environment do
    scm = OpenProject::Configuration['scm']
    if scm.nil?
      abort "No repository configuration is set.\n" \
            "(Configuration resides under key 'scm' in `config/configuration.yaml`)"
    end

    scm.each_pair do |vendor, config|
      vendor = vendor.to_s.classify
      managed = config['manages']

      puts "-- #{vendor} --"

      if managed.nil?
        puts 'This vendor does not use managed repositories. Skipping.'
        next
      end

      unless Dir.exists?(managed)
        $stderr.puts "WARNING: Managed repository path '#{managed}' does not exist!"
        next
      end

      missing = scan_repositories(managed)

      if missing.empty?
        puts 'Found no unassociated repositories. ✓'
      else
        puts <<-WARNING

Found #{missing.length} repositories in #{managed}
without an associated project.

#{missing.map { |identifier| "> #{identifier}" }.join("\n")}

When using managed repositories of the vendor #{vendor}, OpenProject will not create
repositories whose associated project identifier is contained in the list above.

To resolve these cases, you can either:

1. Remove the affected repositories if they are only remains of earlier projects

2. Move them out of the OpenProject managed directory '#{managed}'

3. Create an associated project and linking that repository
   as existing through the Frontend.

        WARNING
      end
    end
  end
end
